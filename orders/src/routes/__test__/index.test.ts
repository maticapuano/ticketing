import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "Ticket",
    price: 25,
  });

  await ticket.save();

  return ticket;
};

it("Return an 401 unauthorized if not provider token", async () => {
  await request(app).get("/api/orders").expect(401);
});

it("Feches all orders a user particular", async () => {
  //Create tickets
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThee = await createTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  //Create Two orders as User

  //Create order for user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //Create order for user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id });

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThee.id });

  //Make request to get order for user
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  //Make sure we only got the orders for user
  expect(response.body.data.length).toEqual(2);

  expect(response.body.data[0].id).toEqual(orderOne.order.id);
  expect(response.body.data[1].id).toEqual(orderTwo.order.id);

  //Test ticket
  expect(response.body.data[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body.data[1].ticket.id).toEqual(ticketThee.id);
});
