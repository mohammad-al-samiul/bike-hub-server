import { JwtPayload } from "jsonwebtoken";
import { TRental } from "./rental.interface";
import mongoose from "mongoose";
import { User } from "../auth/auth.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Rental } from "./rental.model";
import { Bike } from "../bikes/bike.model";

const createRentalIntoDB = async (payload: TRental, decodInfo: JwtPayload) => {
  const { email, role } = decodInfo;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findOne({ email, role });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User is not authorized");
    }

    const userEmail = user.email as string;
    payload.userEmail = userEmail;

    const result = await Rental.create([payload], { session }); //return array

    await Bike.findOneAndUpdate(
      { _id: payload.bikeId },
      { isAvailable: false },
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

const returnBikeIntoDB = async (id: string) => {
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
    const returnTime = new Date().toISOString().split(".")[0] + "Z";
    const startTime = new Date(rental?.startTime); // TypeScript already infers this as Date
    const timeDifference = new Date(returnTime).getTime() - startTime.getTime(); // Use .getTime() to get the time in milliseconds
    const totalHours = timeDifference / (1000 * 60 * 60);
    const totalCost = bike.pricePerHour * totalHours;

    const updateDoc = {
      isReturned: true,
      returnTime,
      totalCost: totalCost.toFixed(2),
    };
    const result = await Rental.findOneAndUpdate({ _id: id }, updateDoc, {
      new: true,
      session,
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

  const result = await Rental.find({ userId: user._id });
  return result;
};

export const RentalServices = {
  createRentalIntoDB,
  returnBikeIntoDB,
  getAllRentalsIntoDB,
};
