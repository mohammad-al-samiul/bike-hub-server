/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from "mongoose";
import { TRental } from "./rental.interface";
import { Bike } from "../bikes/bike.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../auth/auth.model";
import { model } from "mongoose";

const rentalSchema = new Schema<TRental>({
  userEmail: {
    type: String,
  },
  bikeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Bike",
  },
  startTime: {
    type: String,
    required: true,
  },
  returnTime: {
    type: String,
    default: null,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  transactionId: {
    type: String,
  },

  isReturned: {
    type: Boolean,
    default: false,
  },
});

rentalSchema.pre("save", async function (next) {
  try {
    const isBikeExist = await Bike.findOne({ _id: this?.bikeId });

    if (!isBikeExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not found!");
    }

    if (!isBikeExist.isAvailable) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "Bike is not available!"
      );
    }

    const isUserExist = await User.findOne({ email: this?.userEmail });
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
    }

    next(); // Call next to proceed
  } catch (error: any) {
    next(error); // Pass error to next middleware
  }
});

export const Rental = model<TRental>("Rental", rentalSchema);
