import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Return a 401 unauthorized if not authenticated.", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app).get(`/api/orders/${id}`);

  expect(response.status).toEqual(401);
});
