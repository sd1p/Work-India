import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/envConfig";

export const jwtSign = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const jwtVerify = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
