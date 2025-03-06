"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(options) {
        const { type, id } = options;
        super();
        Error.captureStackTrace(this, this.constructor);
        this.message = `${type} with id ${id} could not be found.`;
    }
}
exports.NotFoundError = NotFoundError;
