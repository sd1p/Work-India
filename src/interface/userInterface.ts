import { z } from "zod";
import { Role, User } from "@prisma/client";
const registerUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.nativeEnum(Role),
});

const loginUserSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface IRegisterUser extends z.infer<typeof registerUserSchema> {}
export interface ILoginUser extends z.infer<typeof loginUserSchema> {}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
