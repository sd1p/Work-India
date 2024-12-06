import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import ErrorHandler from "../utils/ErrorHandler";
import {
  bookTrainService,
  getBookingDetailsService,
} from "../services/bookingServices";
import { bookingQueue } from "../services/bookingQueue";
import DBconfig from "../config/dbConfig";

const prisma = DBconfig.getInstance();

export const bookTrainController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { trainId } = req.body;

      if (!req.user) {
        throw new ErrorHandler("Unauthorized", 401);
      }

      const userId = req.user.id;

      const booking = await prisma.booking.create({
        data: {
          userId,
          trainId,
          status: "PENDING",
        },
      });

      bookingQueue
        .addToQueue({ userId, trainId, bookingId: booking.id })
        .then((processedBooking) => {
          console.log(`Booking processed:`, processedBooking);
        })
        .catch((err) => {
          console.error(`Error processing booking ${booking.id}:`, err);
        });

      // Respond immediately with the pending booking ID
      res.status(202).json({
        message: "Your booking request is being processed.",
        bookingId: booking.id,
      });
    } catch (err) {
      console.error("Error booking train:", err);
      throw new ErrorHandler(`${err}`, 500);
    }
  }
);

export const getBookingDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.body;
      const booking = await getBookingDetailsService(bookingId);
      if (!booking) {
        throw new ErrorHandler("Invalid booking id", 404);
      }
      res.status(200).json(booking);
    } catch (err) {
      throw new ErrorHandler(
        "An unexpected error occurred while fetching booking details",
        500
      );
    }
  }
);
