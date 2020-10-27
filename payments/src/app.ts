import express, { NextFunction, Response, Request } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@mcticketing/common";
import { indexPaymentRouter } from "./routes/index";

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUser);

app.use(indexPaymentRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

export { app };
