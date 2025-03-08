import { todoController } from "@/application/controllers/todo.controller";
import { DynamoDbTodoRepository } from "@/infrastructure/repositories/todo.repositories.dynamodb";
import { InMemoryTodoRepository } from "@/infrastructure/repositories/todo.repositories.inmemory";
import { Express } from "express";

export const routerContollersSetup = (app: Express) => {
  todoController(app, new DynamoDbTodoRepository());
};
