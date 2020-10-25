import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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

    //Listener Events
  } catch (err) {
    console.log(err);
  }
};

start();
