export const DATABASE_URL = process.env.DATABASE_URL;

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const NODE_ENV = process.env.NODE_ENV;
