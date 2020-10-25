import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@mcticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.getClient);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};
