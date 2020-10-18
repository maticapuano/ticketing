import { TicketCreatedEvent } from "@mcticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //Create a instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.getClient);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 15.32,
    title: "test",
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // create a faker message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Creates and save a ticket", async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object
  await listener.onMessage(data, msg);

  //write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
});
