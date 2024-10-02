import express from "express";
import { UserControllers } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./auth.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./auth.constant";

const authRouter = express.Router();
const userRouter = express.Router();

authRouter.post(
  "/signup",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);

authRouter.post(
  "/login",
  validateRequest(UserValidation.loginUserValidationSchema),
  UserControllers.loginUser
);

authRouter.post(
  "/refresh-token",
  validateRequest(UserValidation.refreshTokenValidationSchema),
  UserControllers.refreshToken
);

authRouter.get("/users", auth(USER_ROLE.admin), UserControllers.getAllUser);

userRouter.get("/me", UserControllers.getProfile);

userRouter.put(
  "/me",
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateProfile
);

userRouter.delete("/:id", auth(USER_ROLE.admin), UserControllers.deleteUser);

userRouter.put("/:id", auth(USER_ROLE.admin), UserControllers.updateUserRole);

export const userRoutes = { authRouter, userRouter };
