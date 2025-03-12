import { todoController } from "@/application/controllers/todo.controller";
import { DynamoDbTodoRepository } from "@/infrastructure/repositories/todo.repositories.dynamodb";
import { Express } from "express";

export const routerContollersSetup = (app: Express) => {
  todoController(app, new DynamoDbTodoRepository());
};
