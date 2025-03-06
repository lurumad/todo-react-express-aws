export class NotFoundError extends Error {
  constructor(options: { type: string; id: string }) {
    const { type, id } = options;
    super();
    Error.captureStackTrace(this, this.constructor);

    this.message = `${type} with id ${id} could not be found.`;
  }
}
