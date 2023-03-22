import { NextFunction, Request, Response } from "express";
import { isValidationError, ValidationError } from "../types/validationError";

export function errorHandler(
  err: Error | ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isValidationError(err)) {
    res.status(400).json({ errors: err.errors });
  }
  res.status(500).json({ error: err.stack });
}
