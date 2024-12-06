import { Router } from "express";
import {
  createTrain,
  getTrainAvailability,
} from "../controllers/trainController";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware";

const trainRouter = Router();

trainRouter.post("/train", adminAuthMiddleware, createTrain);
trainRouter.post(
  "/train/availablity",
  userAuthMiddleware,
  getTrainAvailability
);

export default trainRouter;
