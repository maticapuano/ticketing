import express, { NextFunction, Response, Request } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@mcticketing/common";
import { newTicketRouter } from "./routes/new";
import { showTicketsRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUser);

app.use(newTicketRouter);
app.use(showTicketsRouter);
app.use(indexTicketRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

export { app };
