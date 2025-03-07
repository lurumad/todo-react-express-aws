import { appSetup } from "@/setup/init";
import { middlewaresSetup } from "@/setup/middlewares";
import express from "express";
import request from "supertest";
import { todoController } from "./todo.controller";
import { TodoStatus } from "@/domain/entities/model";
import { InMemoryTodoRepository } from "@/infrastructure/repositories/todo.repositories.inmemory";

const app = express();
appSetup(app);
middlewaresSetup(app);

describe("Todo", () => {
  beforeAll(() => {
    todoController(app, new InMemoryTodoRepository());
  });

  it("creates a new todo", async () => {
    const newTodo = {
      text: "Todo",
    };

    await request(app)
      .post("/todos")
      .send(newTodo)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    await request(app)
      .get(`/todos`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              text: "Todo",
              status: TodoStatus.Pending,
            }),
          ])
        );
      });
  });

  it("deletes a todo", async () => {
    const newTodo = {
      text: "Todo",
    };

    const response = await request(app)
      .post("/todos")
      .send(newTodo)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const todo = response.body;

    await request(app).delete(`/todos/${todo.id}`).expect(204);

    await request(app)
      .get(`/todos`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        expect(res.body).not.toContainEqual(
          expect.objectContaining({
            id: todo.id,
            text: "Todo",
            status: TodoStatus.Pending,
          }),
        );
      });
  });

  it("updates a todo", async () => {
    const newTodo = {
      text: "Todo",
    };

    const response = await request(app)
      .post("/todos")
      .send(newTodo)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const todo = response.body;

    await request(app)
      .put(`/todos/${todo.id}`)
      .send({ status: TodoStatus.Completed })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: todo.id,
            text: "Todo",
            status: TodoStatus.Completed,
          }),
        );
      });
  });
});
