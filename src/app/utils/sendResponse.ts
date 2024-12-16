import { Response } from "express";

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  token?: string;
  data: T;
  meta?: object;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    token: data?.token,
    data: data?.data,
    meta: data?.meta,
  });
};

export default sendResponse;
