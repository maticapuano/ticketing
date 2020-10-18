import { TicketCreatedEvent } from "@mcticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //Create a instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.getClient);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 15.32,
    title: "Concert",
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // create a faker message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};
