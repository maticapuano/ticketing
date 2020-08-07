import express from "express";
import { currentUserRouter } from "./routes/currentUser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(currentUserRouter);

app.listen(3000, () => {
  console.log(`Server ready on PORT 3000`);
});
