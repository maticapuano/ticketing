import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

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
