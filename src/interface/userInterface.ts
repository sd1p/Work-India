import { z } from "zod";
import { Role } from "@prisma/client";

const userRegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.nativeEnum(Role),
});

const userLoginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface IuserRegister extends z.infer<typeof userRegisterSchema> {}
export interface IuserLogin extends z.infer<typeof userLoginSchema> {}
