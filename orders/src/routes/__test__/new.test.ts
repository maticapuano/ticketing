import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@mcticketing/common";

it("Return an error if the ticket does not exits", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("Return an 401 unauthorized if not provided cookie at token", async () => {
  const response = await request(app).post("/api/orders").send();

  expect(response.status).toEqual(401);
});

it("Returns an error if the ticket is already reserved.", async () => {
  const ticket = Ticket.build({
    title: "Foo ticket concert",
    price: 250,
  });

  await ticket.save();

  //Create order of the ticket
  const order = Order.build({
    ticket: ticket.id,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  //Expected after bad request
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});
