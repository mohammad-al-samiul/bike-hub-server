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
  const result = await Bike.find();
  return result;
};

const getBikeWithPagination = async (queryParams: any) => {
  const { search, category, page, limit } = queryParams;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.brand = category;
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const bikes = await Bike.find(query)
    .select("-createdAt -updatedAt -__v")
    .skip(skip)
    .limit(parseInt(limit as string));

  const totalCount = await Bike.countDocuments(query);

  return {
    docs: bikes,
    totalDocs: totalCount,
  };
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
  getBikeWithPagination,
  getSingleBikeFromDB,
  updateBikeFromDB,
  deleteBikeFromDB,
};
