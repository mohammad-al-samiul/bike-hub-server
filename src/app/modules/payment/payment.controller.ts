import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { paymentServices } from "./payment.service";

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;

  const result = await paymentServices.confirmationServiceIntoDB(
    transactionId as string,
    status as string
  );

  res.send(result);
});

const createPayment = catchAsync(async (req, res) => {
  const paymentData = req.body;
  const result = await paymentServices.createPaymentIntoDb(paymentData);
  res.send(result);
});

const getAllPayment = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;

  const result = await paymentServices.getAllPayment(token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment data retrived successfully",
    data: result,
  });
});

const testPayment = catchAsync(async (req, res) => {
  const paymentData = req.body;
  const result = await paymentServices.testPaymentIntoDb(paymentData);
  res.send(result);
});

export const paymentControllers = {
  confirmationController,
  createPayment,
  getAllPayment,
  testPayment,
};
