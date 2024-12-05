import { PrismaClient } from "@prisma/client";

// Singleton for DB connection

class DBconfig {
  private static prismaClient: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DBconfig.prismaClient) {
      DBconfig.prismaClient = new PrismaClient();
    }
    return DBconfig.prismaClient;
  }
}

export default DBconfig;
