import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import ErrorHandler from "../utils/ErrorHandler";
import {
  bookTrainService,
  getBookingDetailsService,
} from "../services/bookingServices";

export const bookTrainController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { trainId } = req.body;
      if (!req.user) {
        throw new ErrorHandler("Unauthorized", 401);
      }
      const userId = req.user.id;

      const booking = await bookTrainService({ userId, trainId });

      res.status(201).json(booking);
    } catch (err) {
      throw new ErrorHandler(`An unexpected error occurred while booking`, 500);
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
