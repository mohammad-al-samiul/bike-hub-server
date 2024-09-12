import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser, TUpdateUser, TUser } from "./auth.interface";
import { User } from "./auth.model";
import bcrypt from "bcrypt";
import config from "../../config";
import createToken from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const loginUserFromDB = async (payload: TLoginUser) => {
  const isUserExist = await User.findOne({ email: payload.email }).select(
    "+password -createdAt -updatedAt"
  );

  const user = isUserExist;
  //check if a user with this email
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email!");
  }

  //compare password using bcrypt
  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    isUserExist?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
  }

  //generate access token
  const jwtPayload = {
    email: isUserExist?.email,
    role: isUserExist?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);
  //console.log("decoded : ", decoded); //email and role
  const { email } = decoded as JwtPayload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

//get user profile with access token
const getProfileFromDB = async (token: string) => {
  const { email, role } = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const user = await User.findOne({ email, role });
  return user;
};

const updateProfileFromDB = async (payload: TUpdateUser, token: string) => {
  const { email, role } = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email, role });
  if (!isUserExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }
  const result = await User.findOneAndUpdate({ email, role }, payload, {
    new: true,
  }).select("-isDeleted -createdAt -updatedAt -__v");
  return result;
};
export const UserServices = {
  createUserIntoDB,
  loginUserFromDB,
  getAllUserFromDB,
  refreshToken,
  getProfileFromDB,
  updateProfileFromDB,
};
