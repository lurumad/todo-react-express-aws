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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const middlewares_1 = require("./middlewares");
describe("middlewaresSetup", () => {
    it("parses JSON request bodies", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        (0, middlewares_1.middlewaresSetup)(app);
        app.post("/test-json", (req, res) => {
            res.json(req.body);
        });
        yield (0, supertest_1.default)(app)
            .post("/test-json")
            .send({ key: "value" })
            .expect("Content-Type", /json/)
            .expect(200, { key: "value" });
    }));
    it("parses URL-encoded request bodies", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        (0, middlewares_1.middlewaresSetup)(app);
        app.post("/test-urlencoded", (req, res) => {
            res.json(req.body);
        });
        yield (0, supertest_1.default)(app)
            .post("/test-urlencoded")
            .send("key=value")
            .expect("Content-Type", /json/)
            .expect(200, { key: "value" });
    }));
});
