import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.createUserIntoDB(userData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userDataFromDB } = result.toObject();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User is created successfully!",
    data: userDataFromDB,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.loginUserFromDB(userData);
  const { accessToken, refreshToken, user } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    token: accessToken,
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully!",
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await UserServices.getProfileFromDB(token!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const updatedDoc = req.body;
  const token = req.headers.authorization as string;
  const result = await UserServices.updateProfileFromDB(updatedDoc, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  refreshToken,
  getAllUser,
  getProfile,
  updateProfile,
};
