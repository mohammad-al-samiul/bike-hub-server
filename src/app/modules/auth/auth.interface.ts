import { USER_ROLE } from "./auth.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone?: number; //optional phone number
  address?: string; //optional address
  role?: "admin" | "user";
  isDeleted?: boolean;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TUpdateUser = {
  name?: string;
  phone?: number;
};

export type TJwtPayload = {
  email: string;
  role: string;
};

export type TUserRole = keyof typeof USER_ROLE;
