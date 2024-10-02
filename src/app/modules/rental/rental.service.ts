/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { TRental } from "./rental.interface";
import mongoose from "mongoose";
import { User } from "../auth/auth.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Rental } from "./rental.model";
import { Bike } from "../bikes/bike.model";

/*
import { v4 as uuidv4 } from "uuid";

function generateTransactionId() {
  return `TXN-${uuidv4()}`; // Generates a random UUID prefixed with TXN-
}
  */

const createRentalIntoDB = async (
  payload: TRental,
  decodedInfo: JwtPayload
) => {
  const { email, role } = decodedInfo;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findOne({ email, role });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }
    const userEmail = user.email;
    payload.userEmail = userEmail;

    const result = await Rental.create([payload], { session });

    await Bike.findOneAndUpdate(
      { _id: payload.bikeId },
      { isAvailable: false },
      { new: true, session }
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Failed to create rental"
    );
  } finally {
    session.endSession();
  }
};

const returnBikeIntoDB = async (id: string, endTime: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const rental = await Rental.findOne({ _id: id });

    if (!rental) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid ID");
    }

    const bike = await Bike.findOne({ _id: rental.bikeId });
    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not found!");
    }

    // calculate cost based on time
    const returnTime = new Date(endTime);
    const startTime = new Date(rental?.startTime); // TypeScript already infers this as Date
    const timeDifference = new Date(returnTime).getTime() - startTime.getTime(); // Use .getTime() to get the time in milliseconds
    const totalHours = timeDifference / (1000 * 60 * 60);
    const totalCost = bike.pricePerHour * totalHours;

    const formattedReturnTime = returnTime.toISOString().slice(0, 19) + "Z";
    const updateDoc = {
      isReturned: true,
      returnTime: formattedReturnTime,
      totalCost: totalCost.toFixed(2),
    };
    //  console.log("updateDoc", updateDoc);
    const result = await Rental.findOneAndUpdate({ _id: id }, updateDoc, {
      new: true,
      session,
    }).populate({
      path: "bikeId",
      model: "Bike",
    });

    await Bike.findOneAndUpdate(
      { _id: rental.bikeId },
      { isAvailable: true },
      { session }
    );

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  } finally {
    session.endSession();
  }
};

const getAllRentalsIntoDB = async (decodedInfo: JwtPayload) => {
  const { email, role } = decodedInfo;
  const user = await User.findOne({ email, role });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not authorized!");
  }

  let result;
  if (role === "admin") {
    result = await Rental.find().populate({
      path: "bikeId",
      model: "Bike",
    });
  } else {
    result = await Rental.find({ userEmail: email }).populate({
      path: "bikeId",
      model: "Bike",
    });
  }

  return result;
};

const getSingleRentIntoDB = async (id: string) => {
  const result = await Rental.findOne({ _id: id }).populate({
    path: "bikeId",
    model: "Bike",
  });
  return result;
};

export const RentalServices = {
  createRentalIntoDB,
  returnBikeIntoDB,
  getAllRentalsIntoDB,
  getSingleRentIntoDB,
};
