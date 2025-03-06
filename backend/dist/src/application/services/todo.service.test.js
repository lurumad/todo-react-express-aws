"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TodoRepository_1 = require("@/infrastructure/repositories/TodoRepository");
const todo_service_1 = require("./todo.service");
const model_1 = require("@/domain/entities/model");
vi.mock("../../infrastructure/repositories/TodoRepository");
describe("Todo Service", () => {
    it("creates a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const todoRepository = new TodoRepository_1.TodoRepository();
        const todoService = new todo_service_1.TodoService(todoRepository);
        yield todoService.add({
            id: "1234",
            text: "todo title",
            status: model_1.TodoStatus.Pending,
        });
        expect(todoRepository.add).toHaveBeenCalledWith({
            id: "1234",
            text: "todo title",
            status: model_1.TodoStatus.Pending,
        });
    }));
    it("gets a list of todos", () => __awaiter(void 0, void 0, void 0, function* () {
        const todoRepository = new TodoRepository_1.TodoRepository();
        const todoService = new todo_service_1.TodoService(todoRepository);
        todoRepository.list = vi.fn().mockResolvedValue([{
                id: "1234",
                title: "todo title",
                status: model_1.TodoStatus.Pending,
            }]);
        expect(yield todoService.list()).toEqual([{
                id: "1234",
                title: "todo title",
                status: model_1.TodoStatus.Pending,
            }]);
    }));
});
