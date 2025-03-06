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
const model_1 = require("@/domain/entities/model");
const TodoRepository_1 = require("./TodoRepository");
describe("todo Repository", () => {
    it("creates a new todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const todoRepository = new TodoRepository_1.TodoRepository();
        yield todoRepository.add({
            id: "1234",
            text: "todo title",
            status: model_1.TodoStatus.Pending,
        });
        expect(yield todoRepository.list()).toEqual([{
                id: "1234",
                text: "todo title",
                status: model_1.TodoStatus.Pending,
            }]);
    }));
});
