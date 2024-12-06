import DBconfig from "../config/dbConfig";
import { IBookingData } from "../interface/bookingInterface";
import ErrorHandler from "../utils/ErrorHandler";

const prisma = DBconfig.getInstance();
export const bookTrainService = async (data: IBookingData) => {
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const train: { available_seats: number; total_seats: number }[] =
        await tx.$queryRaw`
        SELECT available_seats, total_seats
        FROM "Train"
        WHERE id = ${data.trainId}
        FOR UPDATE
      `;

      if (!train || train.length === 0) {
        throw new Error("Train not found.");
      }

      const { available_seats, total_seats } = train[0];

      if (available_seats <= 0) {
        throw new Error("No seats available.");
      }
      const bookedSeats = await tx.booking.findMany({
        where: { trainId: data.trainId },
        select: { seatNumber: true },
        orderBy: { seatNumber: "asc" },
      });

      const occupiedSeatNumbers = bookedSeats.map((seat) => seat.seatNumber);
      let seatNumber = 1;
      while (
        occupiedSeatNumbers.includes(seatNumber) &&
        seatNumber <= total_seats
      ) {
        seatNumber++;
      }

      if (seatNumber > total_seats) {
        throw new Error("No available seats.");
      }

      const newBooking = await tx.booking.create({
        data: {
          trainId: data.trainId,
          seatNumber,
          userId: data.userId,
          status: "CONFIRMED",
        },
      });

      await tx.train.update({
        where: {
          id: data.trainId,
        },
        data: {
          available_seats: {
            decrement: 1,
          },
        },
      });

      return newBooking;
    });

    return booking;
  } catch (error) {
    console.error("Booking failed:", error);
    throw new ErrorHandler(`${error}`, 500);
  }
};

export const getBookingDetailsService = async (bookingId: number) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        Train: true,
      },
    });

    if (!booking) {
      throw new ErrorHandler("Booking not found", 404);
    }

    return booking;
  } catch (error) {
    throw new ErrorHandler("An unexpected error occurred", 500);
  }
};
