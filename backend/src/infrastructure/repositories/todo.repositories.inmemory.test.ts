import { TodoStatus } from "@/domain/entities/model";
import { InMemoryTodoRepository } from "./todo.repositories.inmemory";

describe("todo Repository", () => {
  it("creates a new todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const userId = "1234";
    await todoRepository.add({
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Pending,
    });

    expect(await todoRepository.list(userId)).toEqual([{
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Pending,
    }]);
  });

  it("deletes a todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const userId = "1234";
    const todo = {
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoRepository.add(todo);
    await todoRepository.delete(todo);

    expect(await todoRepository.list(userId)).toEqual([]);
  });

  it("updates a todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const userId = "1234";
    const todo = {
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoRepository.add(todo);
    await todoRepository.update({
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Completed,
    });

    expect(await todoRepository.list(userId)).toEqual([{
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Completed,
    }]);
  });

  it("gets a todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const userId = "1234";
    const todo = {
      id: "1234",
      userId: userId,
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoRepository.add(todo);
    expect(await todoRepository.get(userId, "1234")).toEqual(todo);
  });
});
