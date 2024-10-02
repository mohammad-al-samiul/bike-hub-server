import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RentalServices } from "./rental.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRental = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const rentalInfo = req.body;

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const result = await RentalServices.createRentalIntoDB(rentalInfo, decoded);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Bike rent successfully!",
    data: result,
  });
});

const returnBike = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { endTime } = req.body;

  const result = await RentalServices.returnBikeIntoDB(id, endTime);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bike return successfull!",
    data: result,
  });
});

const getRentals = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const result = await RentalServices.getAllRentalsIntoDB(decoded);
  //console.log("result", result);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rentals retrieved successfully!",
    data: result,
  });
});

const getSingleRent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await RentalServices.getSingleRentIntoDB(id);
  //console.log("result", result);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental retrieved successfully!",
    data: result,
  });
});

export const RentalControllers = {
  createRental,
  returnBike,
  getRentals,
  getSingleRent,
};
