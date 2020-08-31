import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must defined");
  }

  try {
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Mongodb connected [tickets]");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log(`Server ready on PORT 3000`);
  });
};

start();
