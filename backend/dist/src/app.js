"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const init_1 = require("./setup/init");
const router_1 = require("./setup/router");
const middlewares_1 = require("./setup/middlewares");
const app = (0, express_1.default)();
(0, init_1.appSetup)(app);
(0, router_1.routerSetup)(app);
(0, middlewares_1.middlewaresSetup)(app);
