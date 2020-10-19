import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("Return a 401 unauthorized if not authenticated.", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app).get(`/api/orders/${id}`);

  expect(response.status).toEqual(401);
});

it("Return a order by id current user", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert pop",
    price: 256.99,
  });
  await ticket.save();

  //Create a User
  const user = global.signin();

  //Create Order for current user.
  const createOrder = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const id = createOrder.body.order.id;
  const order = await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", user)
    .expect(200);

  expect(order.status).toEqual(200);
  expect(order.body.data.ticket.id).toEqual(ticket.id);
});

it("Return an error if one user tries to fetch another user order.", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concer rock!!",
    price: 963.99,
  });
  await ticket.save();

  //Create two user real and fake user fetch
  const userReal = global.signin();
  const userBad = global.signin();

  //Create Order for user Real
  const orderReal = await request(app)
    .post("/api/orders")
    .set("Cookie", userReal)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Fetch order for user real
  const idOrderReal = orderReal.body.order.id;
  const getOrderReal = await request(app)
    .get(`/api/orders/${idOrderReal}`)
    .set("Cookie", userReal)
    .expect(200);

  expect(getOrderReal.status).toEqual(200);
  expect(getOrderReal.body.data.ticket.id).toEqual(ticket.id);

  //Fetch order other user not is real.
  const orderBadUser = await request(app)
    .get(`/api/orders/${idOrderReal}`)
    .set("Cookie", userBad)
    .send();

  expect(orderBadUser.status).toEqual(401);
});
