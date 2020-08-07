import express from "express";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);

app.listen(3000, () => {
  console.log(`Server ready on PORT 3000`);
});
