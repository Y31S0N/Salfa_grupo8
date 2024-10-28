export const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_jwt";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "tu_secreto_refresh_jwt";
export const JWT_EXPIRES_IN = "15m";
export const JWT_REFRESH_EXPIRES_IN = "7d";
