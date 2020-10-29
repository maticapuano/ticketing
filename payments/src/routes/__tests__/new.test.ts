import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

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
