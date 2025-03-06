"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewaresSetup = void 0;
const NotFoundErrorMapper_1 = require("@/infrastructure/error-mappers/NotFoundErrorMapper");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_http_problem_details_1 = require("express-http-problem-details");
const http_problem_details_mapper_1 = require("http-problem-details-mapper");
const strategy = new http_problem_details_mapper_1.DefaultMappingStrategy(new http_problem_details_mapper_1.MapperRegistry().registerMapper(new NotFoundErrorMapper_1.NotFoundErrorMapper()));
const middlewaresSetup = (app) => {
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, express_http_problem_details_1.HttpProblemResponse)({ strategy }));
};
exports.middlewaresSetup = middlewaresSetup;
const authorization = (req, res, next) => {
    // const token = req.headers.authorization || "";
    // if (!token) {
    //   res.status(401).send("Unauthorized");
    //   return;
    // }
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = decoded;
    //   next();
    // }
};
