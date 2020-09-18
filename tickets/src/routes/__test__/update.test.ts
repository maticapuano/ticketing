import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

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

it("return an 400 bad request if the user provider invalid title or price.", async () => {
  const cookie = global.signin();

  //Create ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "lalala",
      price: 25,
    })
    .expect(201);

  //Update ticket
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -1000,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: "100",
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "good title",
      price: -10,
    })
    .expect(400);
});

it("Update ticket if provider inputs valid", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "lalala",
      price: 25.9,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title updated",
      price: 95,
    })
    .expect(204);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.data.id}`)
    .send();

  expect(ticketResponse.body.data.title).toEqual("title updated");
  expect(ticketResponse.body.data.price).toEqual(95);
  expect(ticketResponse.status).toEqual(200);
});

it("Publishes an event", async () => {
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

  expect(natsWrapper.getClient.publish).toHaveBeenCalled();
});
