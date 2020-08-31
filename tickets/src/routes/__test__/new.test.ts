import request from "supertest";
import { app } from "../../app";

it("Has route handler listing to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});
