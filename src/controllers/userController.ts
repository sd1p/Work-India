import { Request, Response } from "express";

export const registerUser = (req: Request, res: Response) => {
  res.json({ message: "User registered" });
};
