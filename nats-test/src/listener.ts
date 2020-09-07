import nats, { Message } from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "1234", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listen connected to NATS.");

  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (message: Message) => {
    const data = message.getData();

    if (typeof data === "string") {
      console.log(
        `Received event #${message.getSequence()} with data: ${data}`
      );
    }
  });
});
