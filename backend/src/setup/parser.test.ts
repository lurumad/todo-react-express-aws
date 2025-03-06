import express from "express";
import request from "supertest";
import { middlewaresSetup } from "./middlewares";

describe("middlewaresSetup", () => {
  it("parses JSON request bodies", async () => {
    const app = express();
    middlewaresSetup(app);

    app.post("/test-json", (req, res) => {
      res.json(req.body);
    });

    await request(app)
      .post("/test-json")
      .send({ key: "value" })
      .expect("Content-Type", /json/)
      .expect(200, { key: "value" });
  });

  it("parses URL-encoded request bodies", async () => {
    const app = express();
    middlewaresSetup(app);

    app.post("/test-urlencoded", (req, res) => {
      res.json(req.body);
    });

    await request(app)
      .post("/test-urlencoded")
      .send("key=value")
      .expect("Content-Type", /json/)
      .expect(200, { key: "value" });
  });
});
