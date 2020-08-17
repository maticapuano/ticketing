const request = require("supertest");
const { app } = require("../../app");

it("fail's when a email that does not exits", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});
