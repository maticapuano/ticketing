import express from "express";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { siginoutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signup";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(siginoutRouter);
app.use(signUpRouter);

app.listen(3000, () => {
  console.log(`Server ready on PORT 3000`);
});
