import { todoController } from "@/application/controllers/todo.controller";
import { InMemoryTodoRepository } from "@/infrastructure/repositories/InMemoryTodoRepository";
import { Express } from "express";

export const routerSetup = (app: Express) => {
  app.get("/ping", (req, res) => {
    res.status(200).send("pong");
  });

  todoController(app, new InMemoryTodoRepository());
};
