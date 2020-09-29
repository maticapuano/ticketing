import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Return a 401 unauthorized if not at signin", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${id}`);

  expect(response.status).toEqual(401);
});
