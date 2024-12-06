import { bookTrainService } from "../services/bookingServices";
import { IBookingData } from "../interface/bookingInterface";

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
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}

export const bookingQueue = new BookingQueue();
