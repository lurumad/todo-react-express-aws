import { Express } from "express";

export const routerSetup = (app: Express) => {
  app.get("/ping", (req, res) => {
    res.status(200).send("pong");
  });
};
