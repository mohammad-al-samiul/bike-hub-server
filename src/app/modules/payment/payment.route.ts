import express from "express";
import { paymentControllers } from "./payment.controller";
const paymentRouter = express.Router();

paymentRouter.post(
  "create-checkout-session",
  paymentControllers.createCheckoutSession
);
paymentRouter.get("session-status", paymentControllers.getSessionStatus);

export default paymentRouter;
