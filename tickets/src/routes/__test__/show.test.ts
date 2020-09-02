import request from "supertest";
import { app } from "../../app";

it("Returns 404 if ticket is not found", async () => {
  await request(app)
    .get("/api/tickets/foo")
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("Return 200 if a ticket is found", async () => {
  const title = "ticket test";
  const price = 25;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(ticketResponse.body.data.title).toEqual(title);
  expect(ticketResponse.body.data.price).toEqual(price);
});
