"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewaresSetup = void 0;
const NotFoundErrorMapper_1 = require("@/infrastructure/error-mappers/NotFoundErrorMapper");
const body_parser_1 = __importDefault(require("body-parser"));
const express_http_problem_details_1 = require("express-http-problem-details");
const http_problem_details_mapper_1 = require("http-problem-details-mapper");
const strategy = new http_problem_details_mapper_1.DefaultMappingStrategy(new http_problem_details_mapper_1.MapperRegistry().registerMapper(new NotFoundErrorMapper_1.NotFoundErrorMapper()));
const middlewaresSetup = (app) => {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, express_http_problem_details_1.HttpProblemResponse)({ strategy }));
};
exports.middlewaresSetup = middlewaresSetup;
