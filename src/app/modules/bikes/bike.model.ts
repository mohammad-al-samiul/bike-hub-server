import mongoose, { Schema } from "mongoose";
import { TBike } from "./bike.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const bikeSchema = new Schema<TBike>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bikeImage: {
      type: String,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
    },
    cc: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bikeSchema.pre("save", async function (next) {
  const isBikeExist = await Bike.findOne({ name: this?.name });
  if (isBikeExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A bike is already exist with the name"
    );
  }
  next();
});

bikeSchema.pre("findOneAndUpdate", async function (next) {
  const query = this?.getQuery();

  const isBikeExist = await Bike.findOne(query);
  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not found!");
  }
  next();
});

bikeSchema.pre("findOneAndDelete", async function (next) {
  const query = this?.getQuery(); //query :  { _id: '66b638236c23db76e9a9fb66' }

  const isBikeExist = await Bike.findOne(query);
  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not found!");
  }
  next();
});

export const Bike = mongoose.model<TBike>("Bike", bikeSchema);
