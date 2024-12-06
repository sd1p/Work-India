import bcrypt from "bcryptjs";
import { ILoginUser, IRegisterUser } from "../interface/userInterface";
import DBconfig from "../config/dbConfig";
import { jwtSign } from "../utils/jwtUtils";

const prisma = DBconfig.getInstance();

export const registerUserService = async (data: IRegisterUser) => {
  const { username, email, password, role } = data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = jwtSign({ userId: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { token, ...userWithoutPassword };
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

export const loginUserService = async (data: ILoginUser) => {
  const { username, password } = data;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwtSign({ userId: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { token, ...userWithoutPassword };
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};
