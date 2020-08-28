import express, { NextFunction, Response, Request } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { siginoutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signup";

import { errorHandler, NotFoundError } from "@mcticketing/common";

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(siginoutRouter);
app.use(signUpRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

export { app };
