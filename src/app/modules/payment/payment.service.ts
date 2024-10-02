import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { User } from "../auth/auth.model";
import { Rental } from "../rental/rental.model";
import { TPaymentProps } from "./payment.interface";
import jwt from "jsonwebtoken";
import { Payment } from "./payment.model";
import { initiatePayment, verifyPayment } from "./payment.utils";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { startSession } from "mongoose";
import { join } from "path";
import { readFileSync } from "fs";

const confirmationServiceIntoDB = async (
  transactionId: string,
  status: string
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      await Rental.findOneAndUpdate(
        { transactionId },
        { paymentStatus: "Paid" },
        { session }
      );
      await Payment.create([{ transactionId }], { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  if (status === "success") {
    const filePath = join(__dirname, "../../../views/confirmation.html");
    const template = readFileSync(filePath, "utf-8");
    return template;
  } else if (status === "failed") {
    const filePath = join(__dirname, "../../../views/failed.html");
    const template = readFileSync(filePath, "utf-8");
    return template;
  }
};

const createPaymentIntoDb = async (paymentData: TPaymentProps) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Fetch user information
    const user = await User.findOne({
      email: paymentData?.clientEmail,
    });
    const userInfo = {
      clientName: user?.name,
      address: user?.address,
      clientPhoneNo: user?.phone,
    };

    // Generate transaction ID
    const transactionId = `TXN-${uuidv4()}`;

    // Create payment info object
    const paymentInfo = {
      transactionId,
      clientEmail: paymentData.clientEmail,
      bikeId: paymentData?.bikeId,
      bikeName: paymentData?.bikeName,
      totalCost: paymentData.totalCost,
      startTime: paymentData?.startTime,
      returnTime: paymentData?.returnTime,
      ...userInfo,
    };

    // Update rental with transaction ID
    await Rental.findOneAndUpdate(
      { bikeId: paymentData?.bikeId, paymentStatus: "Pending" },
      { transactionId },
      { session }
    );

    // Initiate payment process (outside transaction as it might be an external API call)
    const paymentSession = await initiatePayment(paymentInfo);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return paymentSession;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllPayment = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const { email } = decoded;
  const result = await Payment.find({ clientEmail: email });

  return result;
};

const testPaymentIntoDb = async (paymentData: TPaymentProps) => {
  const user = await User.findOne({
    email: paymentData?.clientEmail,
  });
  const userInfo = {
    clientName: user?.name,
    address: user?.address,
    clientPhoneNo: user?.phone,
  };
  const transactionId = `TXN-${uuidv4()}`;

  // Create payment info object
  const paymentInfo = {
    transactionId,
    clientEmail: paymentData.clientEmail,
    bikeId: paymentData?.bikeId,
    bikeName: paymentData?.bikeName,
    totalCost: paymentData.totalCost,
    startTime: paymentData?.startTime,
    returnTime: paymentData?.returnTime,
    ...userInfo,
  };
  const paymentSession = await initiatePayment(paymentInfo);
  return paymentSession;
};

export const paymentServices = {
  confirmationServiceIntoDB,
  createPaymentIntoDb,
  getAllPayment,
  testPaymentIntoDb,
};
