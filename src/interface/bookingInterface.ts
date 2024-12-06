import { z } from "zod";

export const bookingDataSchema = z.object({
  trainId: z.number().int(),
  userId: z.number().int(),
});

export type IBookingData = z.infer<typeof bookingDataSchema>;
