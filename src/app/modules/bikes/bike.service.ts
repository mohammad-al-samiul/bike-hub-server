/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { TBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeIntoDB = async (file: any, payload: TBike) => {
  const bikeName = `${payload.name}-${payload.year}`;
  const { secure_url } = await sendImageToCloudinary(bikeName, file?.path);
  //console.log(secure_url);
  payload.bikeImage = secure_url;

  const result = await Bike.create(payload);
  return result;
};

const getAllBikeFromDB = async () => {
  const result = await Bike.find().select("-createdAt -updatedAt -__v");
  return result;
};

const updateBikeFromDB = async (payload: Partial<TBike>, id: string) => {
  const result = await Bike.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  return result;
};

const deleteBikeFromDB = async (id: string) => {
  const result = await Bike.findOneAndDelete(
    { _id: id },
    { lean: true }
  ).select("-createdAt -updatedAt -__v");
  return result;
};

export const BikeServices = {
  createBikeIntoDB,
  getAllBikeFromDB,
  updateBikeFromDB,
  deleteBikeFromDB,
};
