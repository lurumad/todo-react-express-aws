"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const TodoRepository_1 = require("@/infrastructure/repositories/TodoRepository");
const todo_service_1 = require("./todo.service");
vi.mock("../../infrastructure/repositories/TodoRepository");
describe("todo Service", () => {
  it("creates a todo", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const TodoRepository = new TodoRepository_1.TodoRepository();
      const todoService = new todo_service_1.todoService(TodoRepository);
      yield todoService.add({
        id: "1234",
        title: "todo title",
      });
      expect(TodoRepository.add).toHaveBeenCalledWith({
        id: "1234",
        title: "todo title",
      });
    }));
  it("gets a todo by its id", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const TodoRepository = new TodoRepository_1.TodoRepository();
      const todoService = new todo_service_1.todoService(TodoRepository);
      TodoRepository.get = vi.fn().mockResolvedValue({
        id: "1234",
        title: "todo title",
      });
      expect(yield todoService.get("1234")).toEqual({
        id: "1234",
        title: "todo title",
      });
    }));
});
