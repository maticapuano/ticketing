import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/me")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.data.email).toEqual("test@test.com");
});
