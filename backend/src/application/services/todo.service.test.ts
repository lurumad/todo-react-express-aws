import { TodoService } from "./todo.service";
import { Todo, TodoStatus } from "@/domain/entities/model";
import { TodoRepository } from "@/domain/repositories/todo.repository";

vi.mock("../../infrastructure/repositories/TodoRepository");

describe("Todo Service", () => {
  let todoRepository: TodoRepository;
  let todoService: TodoService;

  beforeEach(() => {
    todoRepository = {
      add: vi.fn(),
      get: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    };
    todoService = new TodoService(todoRepository);
  });

  it("creates a todo", async () => {
    const todo: Todo = {
      id: "1234",
      userId: "1234",
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoService.add(todo);

    expect(todoRepository.add).toHaveBeenCalledWith(todo);
  });

  it("gets a todo", async () => {
    const id = "1234";
    const userId = "1234";

    const todo = await todoService.get(userId, id);

    expect(todoRepository.get).toHaveBeenCalledWith(userId, id);
  });

  it("gets a list of todos", async () => {
    const todo = {
      id: "1234",
      userId: "1234",
      title: "todo title",
      status: TodoStatus.Pending,
    }

    todoRepository.list = vi.fn().mockResolvedValue([todo]);

    expect(await todoService.list(todo.userId)).toEqual([todo]);
  });

  it("deletes a todo", async () => {
    const todo: Todo = {
      id: "1234",
      userId: "1234",
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoService.delete(todo);

    expect(todoRepository.delete).toHaveBeenCalledWith(todo);
  });

  it("updates a todo", async () => {
    const todo: Todo = {
      id: "1234",
      userId: "1234",
      text: "todo title",
      status: TodoStatus.Pending,
    };

    await todoService.update(todo);

    expect(todoRepository.update).toHaveBeenCalledWith(todo);
  });
});
