import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS.");

  const publisher = new TicketCreatedPublisher(stan);

  publisher.publish({
    id: "1b112ac2-0960-408f-bd24-97e2bc0b7a65",
    price: 12,
    title: "lalala",
  });
});
