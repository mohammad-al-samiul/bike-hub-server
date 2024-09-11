import { z } from "zod";

const rentalValidationSchema = z.object({
  body: z.object({
    userEmail: z.string().email().optional(),
    bikeId: z.string({
      required_error: "bikeId is required!",
    }),
    startTime: z.string({
      required_error: "startTime is required!",
    }),
    returnTime: z.string().optional(),
    totalCost: z.number().optional(),
    isReturn: z.boolean().optional(),
  }),
});

export const RentalValidation = {
  rentalValidationSchema,
};
