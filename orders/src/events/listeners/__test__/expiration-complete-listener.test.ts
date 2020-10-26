import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@mcticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.getClient);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 25,
    title: "concert",
  });

  await ticket.save();

  const order = Order.build({
    ticket: ticket.id,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("Updates the order to cancelled", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder?.status).toEqual(OrderStatus.Canceled);
});

it("Emit an Order cancelled event", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const eventData = JSON.parse(
    (natsWrapper.getClient.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(data.orderId);
});

it("Ack the message.", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
