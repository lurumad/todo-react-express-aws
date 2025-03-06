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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("@/setup/init");
const parser_1 = require("@/setup/parser");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const todo_controller_1 = require("./todo.controller");
const app = (0, express_1.default)();
(0, init_1.appSetup)(app);
(0, parser_1.middlewaresSetup)(app);
describe("todos", () => {
  beforeAll(() => {
    (0, todo_controller_1.todoController)(app);
  });
  it("creates a new todo", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const newtodo = {
        id: "1234",
        title: "todo title",
      };
      yield (0, supertest_1.default)(app)
        .post("/todo")
        .send(newtodo)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      yield (0, supertest_1.default)(app)
        .get(`/todo/${newtodo.id}`)
        .expect(200)
        .expect(newtodo);
    }));
  it("fails to get missing todo", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, supertest_1.default)(app).get(`/todo/missing_id`).expect(404);
    }));
});
