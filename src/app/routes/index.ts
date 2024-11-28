import express from "express";
import { userRoutes } from "../modules/auth/auth.route";
import { bikeRoutes } from "../modules/bikes/bike.route";
import { rentalRoutes } from "../modules/rental/rental.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: userRoutes.authRouter,
  },
  {
    path: "/users",
    route: userRoutes.userRouter,
  },
  {
    path: "/bikes",
    route: bikeRoutes.bikeRouter,
  },
  {
    path: "/rentals",
    route: rentalRoutes.rentalRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
