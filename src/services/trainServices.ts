import { PrismaClient } from "@prisma/client";
import ErrorHandler from "../utils/ErrorHandler";
import DBconfig from "../config/dbConfig";
import { ITrainCreate, ITrainQuery } from "../interface/trainInterface";

const prisma = DBconfig.getInstance();

export const createTrainService = async (data: ITrainCreate) => {
  try {
    const train = await prisma.train.create({
      data: {
        name: data.name,
        departure_time: data.departure_time,
        source: data.source,
        destination: data.destination,
        total_seats: data.total_seats,
        available_seats: data.total_seats,
      },
    });
    if (!train) {
      throw new ErrorHandler("An unexpected error occurred", 500);
    }
    return train;
  } catch (error) {
    throw new ErrorHandler("An unexpected error occurred", 500);
  }
};

export const getTrainAvailabilityService = async (data: ITrainQuery) => {
  const { source, destination, currentTime } = data;

  try {
    const trains = await prisma.train.findMany({
      where: {
        source,
        destination,
        departure_time: {
          gte: currentTime,
        },
        available_seats: {
          gt: 0,
        },
      },
    });
    if (!trains) {
      throw new ErrorHandler("No trains available", 404);
    }

    return trains;
  } catch (error) {
    throw new ErrorHandler("An unexpected error occurred", 500);
  }
};
