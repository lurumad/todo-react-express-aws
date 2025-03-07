import { Todo } from "@/domain/entities/model";
import { TodoRepository } from "@/domain/repositories/todo.repository";

const todos: Record<string, Record<string, Todo>> = {};

export class InMemoryTodoRepository implements TodoRepository {
  public async add(todo: Todo) {
    if (!todos[todo.userId]) {
      todos[todo.userId] = {};
    }
    todos[todo.userId][todo.id] = todo;
  }

  public async list(userId: string) {
    return Object.values(todos[userId] || {});
  }

  public async delete(todo: Todo) {
    if (todos[todo.userId]) {
      delete todos[todo.userId][todo.id];
    }
  }

  public async get(userId: string, id: string) {
    return todos[userId] ? todos[userId][id] : undefined;
  }

  public async update(todo: Todo) {
    if (todos[todo.userId]) {
      todos[todo.userId][todo.id] = todo;
    }
  }
}
