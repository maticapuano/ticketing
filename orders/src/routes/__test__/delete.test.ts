import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@mcticketing/common";
import { Order } from "../../models/order";

it("Return a 401 unauthorized if not at signin", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${id}`);

  expect(response.status).toEqual(401);
});

it("Mark a order as Canceled", async () => {
  const ticket = Ticket.build({ title: "Concert pop!!", price: 256.32 });
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
