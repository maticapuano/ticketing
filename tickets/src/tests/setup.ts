import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build JWT payload. at service auth {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
    password: "password",
  };

  //Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build Object. {jwt: JWT...}
  const session = { jwt: token };

  //Turn that session intro JSON
  const sessionJson = JSON.stringify(session);

  //Take json and encode it as base64
  const base64Token = Buffer.from(sessionJson).toString("base64");

  return [`express:sess=${base64Token}`];
};
