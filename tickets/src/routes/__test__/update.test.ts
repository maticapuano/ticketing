import request from "supertest";
import { app } from "../../app";

it("Return a 401 if a user attempt update a ticket without first signed in.", async () => {
  const title = "ticket test";
  const price = 21;

  //Request for create an ticket
  const response = await request(app)
    .post("/api/tickets")
    .send("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  //Update a ticket
  const titleUpdate = "ticket updated";
  const priceUpdate = 95;
  const ticket_id = response.body.data.id;

  await request(app)
    .put(`/api/tickets/${ticket_id}`)
    .send({
      titleUpdate,
      priceUpdate,
    })
    .expect(401);
});
