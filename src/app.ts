import express from "express";
import dotenv from "dotenv";
import trainRouter from "./routes/trainRoutes";
import userRouter from "./routes/userRoutes";
import bookingRouter from "./routes/bookingRoutes";
import {
  errorHandler,
  routeNotFound,
} from "./middlewares/errorHandlerMiddleware";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", trainRouter);
app.use("/api", bookingRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use(routeNotFound);
app.use(errorHandler);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running at port 3000");
});
