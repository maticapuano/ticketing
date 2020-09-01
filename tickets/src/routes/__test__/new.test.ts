import request from "supertest";
import { app } from "../../app";

it("Has route handler listing to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("Can only access if the user is signed.", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Returns a status other that 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("Return an error if is invalid title provided.", async () => {
  //Title null provided
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin()) // set cookie signed in
    .send({
      title: "",
      price: 25,
    })
    .expect(400);

  //Title not provided
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin()) // set cookie signed in
    .send({
      price: 25,
    })
    .expect(400);
});

it("Return an error if is invalid price provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket foo",
      price: "",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket foo",
      price: 0,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket foo",
      price: -25,
    })
    .expect(400);
});

it("Create any ticket valid inputs.", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket test",
      price: 25,
    })
    .expect(201);
});
