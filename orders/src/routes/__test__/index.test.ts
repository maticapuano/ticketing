import request from "supertest";
import { app } from "../../app";

it("Return an 401 unauthorized if not provider token", async () => {
  await request(app).get("/api/orders").expect(401);
});
