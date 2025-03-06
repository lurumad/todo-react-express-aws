import { Todo } from "@/domain/entities/model";
import { TodoRepository } from "@/domain/repositories/todo.repository";

export class TodoService {
  constructor(private todoRepository: TodoRepository) { }

  public async add(todo: Todo) {
    return this.todoRepository.add(todo);
  }

  public async get(userId: string, id: string) {
    return this.todoRepository.get(userId, id);
  }

  public async list(userId: string) {
    return this.todoRepository.list(userId);
  }

  public async delete(todo: Todo) {
    return this.todoRepository.delete(todo);
  }

  public async update(todo: Todo) {
    return this.todoRepository.update(todo);
  }
}
