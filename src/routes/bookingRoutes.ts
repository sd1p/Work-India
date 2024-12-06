import { Router } from "express";
import { userAuthMiddleware } from "../middlewares/authMiddleware";
import {
  bookTrainController,
  getBookingDetailsController,
} from "../controllers/bookingController";

const bookingRouter = Router();

bookingRouter.post("/booking", userAuthMiddleware, bookTrainController);
bookingRouter.post(
  "/booking/details",
  userAuthMiddleware,
  getBookingDetailsController
);

export default bookingRouter;
