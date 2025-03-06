import express from "express";
import request from "supertest";
import { routerSetup } from "./router";

describe("routerSetup", async () => {
  it("returns pong", async () => {
    const app = express();

    routerSetup(app);

    await request(app)
      .get("/ping")
      .expect("Content-Type", /text/)
      .expect(200)
      .expect("pong");
  });
});
