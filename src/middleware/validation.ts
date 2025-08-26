import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { sendError } from "../utils/response";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      sendError(res, errorMessage, 400);
      return;
    }

    next();
  };
};
