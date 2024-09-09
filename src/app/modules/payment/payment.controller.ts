/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.service";

const createCheckoutSession = catchAsync(async (req, res) => {
  const { priceId } = req.body; // Assuming the price ID is sent in the request body
  try {
    const session = await paymentServices.createCheckoutSession(priceId);
    res.send({ clientSecret: session.client_secret });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

const getSessionStatus = catchAsync(async (req, res) => {
  const { session_id } = req.query; // Assuming session ID is passed as a query parameter
  try {
    const sessionStatus = await paymentServices.getSessionStatus(
      session_id as string
    );
    res.send(sessionStatus);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

export const paymentControllers = {
  createCheckoutSession,
  getSessionStatus,
};
