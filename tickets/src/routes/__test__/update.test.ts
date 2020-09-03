import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return an 404 if the provided id does not exits", async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "lala",
      price: 25,
    })
    .expect(404);
});

it("return an 401 if the user is not authenticated", async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "lala",
      price: 120,
    })
    .expect(401);
});

it("return an 401 if user does not own the ticket.", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "foo",
      price: 120,
    });

  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "foo two",
      price: 190,
    })
    .expect(401);
});
