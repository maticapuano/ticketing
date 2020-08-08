import { Response, Request, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something want wrong", err);

  res.status(400).json({
    message: "Something want wrong",
  });
};
