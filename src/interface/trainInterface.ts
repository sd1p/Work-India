import { z } from "zod";

export const trainCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  departure_time: z.date(),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  total_seats: z
    .number()
    .int()
    .positive("Total seats must be a positive integer"),
});

export const trainQuerySchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  currentTime: z.date(),
});

export interface ITrainCreate extends z.infer<typeof trainCreateSchema> {}
export interface ITrainQuery extends z.infer<typeof trainQuerySchema> {}
