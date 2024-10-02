import { Schema, model } from "mongoose";
import { TPaymentInfo } from "./payment.interface";

// Define the payment schema
const paymentSchema = new Schema<TPaymentInfo>(
  {
    transactionId: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    bikeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Payment model
export const Payment = model<TPaymentInfo>("Payment", paymentSchema);
