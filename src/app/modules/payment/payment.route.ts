import express from "express";
import { paymentControllers } from "./payment.controller";
const router = express.Router();

router.post("/confirmation", paymentControllers.confirmationController);

export const paymentRouter = router;
