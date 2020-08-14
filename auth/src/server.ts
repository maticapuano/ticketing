import express, { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import "express-async-errors";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { siginoutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(siginoutRouter);
app.use(signUpRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log(`Server ready on PORT 3000`);
  });
};

start();
