import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./events/nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must defined");
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      "tickets-service",
      "http://nats-srv:4222"
    );

    //Close all connections exiting
    natsWrapper.getClient.on("close", () => {
      console.log("Nats connection closed.");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.getClient.close());
    process.on("SIGTERM", () => natsWrapper.getClient.close());

    await mongoose.connect(process.env.MONGO_URI, {
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
