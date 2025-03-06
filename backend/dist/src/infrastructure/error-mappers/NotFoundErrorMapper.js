"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundErrorMapper = void 0;
const NotFoundError_1 = require("@/domain/errors/NotFoundError");
const http_problem_details_1 = require("http-problem-details");
const http_problem_details_mapper_1 = require("http-problem-details-mapper");
class NotFoundErrorMapper extends http_problem_details_mapper_1.ErrorMapper {
    constructor() {
        super(NotFoundError_1.NotFoundError);
    }
    mapError(error) {
        return new http_problem_details_1.ProblemDocument({
            status: 404,
            title: error.message,
            type: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404",
        });
    }
}
exports.NotFoundErrorMapper = NotFoundErrorMapper;
