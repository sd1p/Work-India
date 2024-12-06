import { bookTrainService } from "../services/bookingServices";
import { IBookingData } from "../interface/bookingInterface";
import DBconfig from "../config/dbConfig";

const prisma = DBconfig.getInstance();

type QueueItem = {
  data: IBookingData;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

class BookingQueue {
  private queue: QueueItem[] = [];
  private processing = false;

  public addToQueue(data: IBookingData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const { data, resolve, reject } = this.queue.shift()!;

      try {
        const result = await bookTrainService(data);

        await prisma.booking.update({
          where: { id: data.bookingId },
          data: { status: "CONFIRMED" },
        });

        resolve(result);
      } catch (error) {
        console.error(`Error processing booking ${data.bookingId}:`, error);

        await prisma.booking.update({
          where: { id: data.bookingId },
          data: { status: "FAILED" },
        });

        reject(error);
      }
    }

    this.processing = false;
  }
}

export const bookingQueue = new BookingQueue();
