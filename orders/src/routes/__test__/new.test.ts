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
