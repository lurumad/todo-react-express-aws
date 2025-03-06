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
exports.todoController = void 0;
const todo_service_1 = require("@/application/services/todo.service");
const TodoRepository_1 = require("@/infrastructure/repositories/TodoRepository");
const todoController = (app) => {
  app.post("/todo", (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const repository = new TodoRepository_1.TodoRepository();
      const service = new todo_service_1.todoService(repository);
      const todo = yield service.add(req.body);
      res.status(201).json(todo);
    })
  );
  app.get("/todo/:id", (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const repository = new TodoRepository_1.TodoRepository();
      const service = new todo_service_1.todoService(repository);
      res.status(200).json(yield service.get(req.params.id));
    })
  );
};
exports.todoController = todoController;
