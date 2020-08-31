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
