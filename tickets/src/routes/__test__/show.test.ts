import request from "supertest";
import { app } from "../../app";

it("Returns 404 if ticket is not found", async () => {
  await request(app)
    .get("/api/tickets/foo")
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});
