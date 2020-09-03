import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return an 404 if the provided id does not exits", async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).expect(404);
});
