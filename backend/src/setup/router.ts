import { todoController } from "@/application/controllers/todo.controller";
import { DynamoDbTodoRepository } from "@/infrastructure/repositories/todo.repositories.dynamodb";
import { InMemoryTodoRepository } from "@/infrastructure/repositories/todo.repositories.inmemory";
import { Express } from "express";

export const routerSetup = (app: Express) => {
  app.get("/ping", (req, res) => {
    res.status(200).send("pong");
  });

  todoController(app, new DynamoDbTodoRepository());
};
