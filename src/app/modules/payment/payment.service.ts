import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { User } from "../auth/auth.model";
import { Rental } from "../rental/rental.model";
import { TPaymentProps } from "./payment.interface";
import jwt from "jsonwebtoken";
import { Payment } from "./payment.model";
import { initiatePayment, verifyPayment } from "./payment.utils";
import { v4 as uuidv4 } from "uuid";

import { startSession } from "mongoose";

const confirmationServiceIntoDB = async (
  transactionId: string,
  status: string
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    try {
      const rental = await Rental.findOne({ transactionId });

      if (rental) {
        const paymentData = {
          transactionId,
          clientEmail: rental?.userEmail,
          amount: rental?.totalCost,
          bikeId: rental?.bikeId,
        };
        await Rental.findOneAndUpdate(
          { transactionId },
          { paymentStatus: "Paid" }
        );

        await Payment.create(paymentData);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error);
    }
  }

  if (status === "success") {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      rel="stylesheet"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Payment Confirmation</title>
    <style>
      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
      .btn-custom {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        font-size: 18px;
        border-radius: 5px;
        text-decoration: none;
      }

      .btn-custom:hover {
        background-color: #218838;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
            <h2>Your payment was successful</h2>
            <p>
              Thank you for your payment. we will <br />
              be in contact with more details shortly
            </p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </body>
</html>

    `;
  } else if (status === "failed") {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      rel="stylesheet"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Payment Confirmation</title>
    <style>
      ._failed {
        border-bottom: solid 4px red !important;
      }
      ._failed i {
        color: red !important;
      }

      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success _failed">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <h2>Your payment failed</h2>
            <p>Try again later</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

    `;
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
    const transactionId = `TXN-${uuidv4().split("-")[0]}`;

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
  let result;
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const { email, role } = decoded;

  if (role === "user") {
    result = await Payment.find({ clientEmail: email }); // Populate bikeId with the corresponding Bike details
  } else {
    result = await Payment.find(); // Populate bikeId for all payments
  }

  return result;
};

export const paymentServices = {
  confirmationServiceIntoDB,
  createPaymentIntoDb,
  getAllPayment,
};
