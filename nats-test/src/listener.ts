import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listen connected to NATS.");

  stan.on("close", () => {
    console.log("Nats connections closed.");

    process.exit(0);
  });

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  subscription.on("message", (message: Message) => {
    const data = message.getData();

    if (typeof data === "string") {
      console.log(
        `Received event #${message.getSequence()} with data: ${data}`
      );

      message.ack();
    }
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
