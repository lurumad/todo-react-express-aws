import express from "express";
import request from "supertest";
import { routerContollersSetup } from "./router.controllers";

describe("routerSetup", async () => {
  it("returns pong", async () => {
    const app = express();

    routerContollersSetup(app);

    await request(app)
      .get("/ping")
      .expect("Content-Type", /text/)
      .expect(200)
      .expect("pong");
  });
});
