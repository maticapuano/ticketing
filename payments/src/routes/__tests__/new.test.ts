import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mcticketing/common";

it("Returns a 404 when punching an order that does not exits", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "foo123",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Return a 401 when pushing an order that doesn't belong the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 9.99,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "foo12345",
      orderId: order.id,
    });

  expect(response.status).toEqual(401);
});

it("Return a 400 when punching a order cancelled", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 25.99,
    status: OrderStatus.Canceled,
    userId,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "foo",
      orderId: order.id,
    })
    .expect(400);
});

it("Return a 204 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 99.99,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(204);
});
