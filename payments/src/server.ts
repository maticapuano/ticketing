import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
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
    console.log("Mongodb connected");

    //Event listener
    new OrderCancelledListener(natsWrapper.getClient).listen();
    new OrderCreatedListener(natsWrapper.getClient).listen();
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log(`Server ready on PORT 3000`);
  });
};

start();
