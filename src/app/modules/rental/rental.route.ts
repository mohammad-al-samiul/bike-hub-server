import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { RentalValidation } from "./rental.validation";
import { RentalControllers } from "./rental.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../auth/auth.constant";

const rentalRouter = express.Router();

rentalRouter.post(
  "/",
  validateRequest(RentalValidation.rentalValidationSchema),
  RentalControllers.createRental
);

rentalRouter.put(
  "/:id/return",
  auth(USER_ROLE.admin),
  RentalControllers.returnBike
);

rentalRouter.get("/", RentalControllers.getRentals);
rentalRouter.get("/:id", RentalControllers.getSingleRent);

export const rentalRoutes = { rentalRouter };
