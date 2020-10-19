import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@mcticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.getClient);

  // Create a fake data
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 25.99,
  });
  await ticket.save();

  // Create a fake message object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "lala",
    price: 999,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  //Create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of thus stuff
  return { msg, data, ticket, listener };
};

it("Finds, update, and saves a ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
