import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./tickets-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "tickets-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!!", data);

    msg.ack();
  }
}
