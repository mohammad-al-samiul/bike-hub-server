/* eslint-disable @typescript-eslint/no-explicit-any */

import { TBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeIntoDB = async (file: any, payload: TBike) => {
  const image_url = file?.path;
  payload.bikeImage = image_url;

  const result = await Bike.create(payload);
  return result;
};

const getAllBikeFromDB = async () => {
  const result = await Bike.find().select("-createdAt -updatedAt -__v");
  return result;
};
const getSingleBikeFromDB = async (id: string) => {
  const result = await Bike.findOne({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return result;
};

const updateBikeFromDB = async (
  file: any,
  payload: Partial<TBike>,
  id: string
) => {
  const image_url = file?.path;
  payload.bikeImage = image_url;

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
  getSingleBikeFromDB,
  updateBikeFromDB,
  deleteBikeFromDB,
};
