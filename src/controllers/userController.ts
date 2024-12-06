import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  loginUserService,
  registerUserService,
} from "../services/userServices";
import ErrorHandler from "../utils/ErrorHandler";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, username, password, role } = req.body;
      const user = await registerUserService({
        email,
        username,
        password,
        role,
      });

      if (!user) {
        throw new ErrorHandler("User not found", 400);
      }
      res.status(201).json(user);
    } catch (err) {
      throw new ErrorHandler("Username and email should be unique", 400);
    }
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await loginUserService({ username, password });
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }
    res.status(200).json(user);
  } catch (err) {
    throw new ErrorHandler("Invalid credentials", 400);
  }
});
