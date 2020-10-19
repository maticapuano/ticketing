import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@mcticketing/common";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("Return a 401 unauthorized if not at signin", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${id}`);

  expect(response.status).toEqual(401);
});

it("Mark a order as Canceled", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert pop!!",
    price: 256.32,
  });
  await ticket.save();

  //Create User
  const user = global.signin();

  //Create a Order.
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Delete a Order
  const id = order.body.order.id;
  const orderCancel = await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", user)
    .send();

  expect(orderCancel.status).toEqual(202);

  //Check if at order if mark at canceled
  const updatedOrder = await Order.findById(id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Canceled);
});

it("Return an error if other user tries to delete order other user.", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert cool!!",
    price: 290.99,
  });

  await ticket.save();

  //Create a user
  const user = global.signin();
  const userBad = global.signin();

  //Create a order for current user
  const order = await request(app)
    .post("/api/orders/")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Tries cancel a order other user
  const id = order.body.order.id;

  const cancelOrderOtherUser = await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", userBad)
    .send();

  expect(cancelOrderOtherUser.status).toEqual(401);
});

it("Emits a event order canceled event.", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert pop!!",
    price: 256.32,
  });
  await ticket.save();

  //Create User
  const user = global.signin();

  //Create a Order.
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Delete a Order
  const id = order.body.order.id;
  const orderCancel = await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", user)
    .send();

  expect(orderCancel.status).toEqual(202);

  //Check if at order if mark at canceled
  const updatedOrder = await Order.findById(id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Canceled);

  //Expected called method publish
  expect(natsWrapper.getClient.publish).toHaveBeenCalled();
});
