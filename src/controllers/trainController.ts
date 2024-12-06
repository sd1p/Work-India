import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import ErrorHandler from "../utils/ErrorHandler";
import {
  createTrainService,
  getTrainAvailabilityService,
} from "../services/trainServices";

export const createTrain = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, departure_time, source, destination, total_seats } = req.body;
    const train = await createTrainService({
      name,
      departure_time,
      source,
      destination,
      total_seats,
    });
    if (!train) {
      throw new ErrorHandler("An unexpected error occurred", 500);
    }
    res.status(201).json(train);
  } catch (err) {
    throw new ErrorHandler("An unexpected error occurred", 500);
  }
});

export const getTrainAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { source, destination, currentTime } = req.body;
      const trains = await getTrainAvailabilityService({
        source,
        destination,
        currentTime,
      });
      if (!trains) {
        throw new ErrorHandler("No trains available", 404);
      }
      res.status(200).json(trains);
    } catch (err) {
      throw new ErrorHandler(
        "An unexpected error occurred while fetching trains",
        500
      );
    }
  }
);
