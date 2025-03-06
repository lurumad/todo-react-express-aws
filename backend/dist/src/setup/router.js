"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerSetup = void 0;
const todo_controller_1 = require("@/application/controllers/todo.controller");
const routerSetup = (app) => {
    app.get("/ping", (req, res) => {
        res.status(200).send("pong");
    });
    (0, todo_controller_1.todoController)(app);
};
exports.routerSetup = routerSetup;
