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
exports.todoController = void 0;
const todo_service_1 = require("@/application/services/todo.service");
const TodoRepository_1 = require("@/infrastructure/repositories/TodoRepository");
const model_1 = require("@/domain/entities/model");
const todoController = (app) => {
    app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const todo = req.body;
        todo.id = crypto.randomUUID();
        todo.status = model_1.TodoStatus.Pending;
        const repository = new TodoRepository_1.TodoRepository();
        const service = new todo_service_1.TodoService(repository);
        yield service.add(todo);
        res.status(201).json(todo);
    }));
    app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = new TodoRepository_1.TodoRepository();
        const service = new todo_service_1.TodoService(repository);
        res.status(200).json(yield service.list());
    }));
    app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const repository = new TodoRepository_1.TodoRepository();
        const service = new todo_service_1.TodoService(repository);
        yield service.delete(id);
        res.status(204).send();
    }));
};
exports.todoController = todoController;
