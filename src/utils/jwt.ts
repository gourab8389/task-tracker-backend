import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { JwtPayload } from "../types/auth";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
