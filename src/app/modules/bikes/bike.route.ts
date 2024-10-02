import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middleware/validateRequest";
import { bikeValidation } from "./bike.validation";
import { BikeController } from "./bike.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../auth/auth.constant";
import { upload } from "../../utils/sendImageToCloudinary";

const bikeRouter = express.Router();

bikeRouter.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(bikeValidation.createBikeValidationSchema),
  auth(USER_ROLE.admin),
  BikeController.createBike
);

bikeRouter.get("/", BikeController.getAllBike);
bikeRouter.get("/:id", BikeController.getSingleBike);

bikeRouter.put(
  "/:id",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(bikeValidation.updateBikeValidationSchema),
  auth(USER_ROLE.admin),
  BikeController.updateBike
);

bikeRouter.delete("/:id", auth(USER_ROLE.admin), BikeController.deleteBike);

export const bikeRoutes = {
  bikeRouter,
};
