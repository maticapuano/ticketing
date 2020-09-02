import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);
};

it("Can fetch a list of tickets.", async () => {
  await createTicket("ticket one", 25);
  await createTicket("ticket two", 100);
  await createTicket("ticket thee", 500);
  await createTicket("ticket four", 900);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.data.length).toEqual(4);
});
