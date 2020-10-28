import { OrderCancelledEvent } from "@mcticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.getClient);

  const data: OrderCancelledEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, listener, data };
};
