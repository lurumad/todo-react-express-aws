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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("@/setup/init");
const middlewares_1 = require("@/setup/middlewares");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const todo_controller_1 = require("./todo.controller");
const model_1 = require("@/domain/entities/model");
const app = (0, express_1.default)();
(0, init_1.appSetup)(app);
(0, middlewares_1.middlewaresSetup)(app);
describe("Todo", () => {
    beforeAll(() => {
        (0, todo_controller_1.todoController)(app);
    });
    it("creates a new todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const newTodo = {
            text: "Todo",
        };
        yield (0, supertest_1.default)(app)
            .post("/todos")
            .send(newTodo)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        yield (0, supertest_1.default)(app)
            .get(`/todos`)
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect((res) => {
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    text: "Todo",
                    status: model_1.TodoStatus.Pending,
                }),
            ]));
        });
    }));
    it("deletes a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const newTodo = {
            text: "Todo",
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/todos")
            .send(newTodo)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const todo = response.body;
        yield (0, supertest_1.default)(app).delete(`/todos/${todo.id}`).expect(204);
        yield (0, supertest_1.default)(app)
            .get(`/todos`)
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect((res) => {
            expect(res.body).not.toContainEqual(expect.objectContaining({
                id: todo.id,
                text: "Todo",
                status: model_1.TodoStatus.Pending,
            }));
        });
    }));
});
