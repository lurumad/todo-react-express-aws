import { NotFoundError } from "@/domain/errors/NotFoundError";
import { ProblemDocument } from "http-problem-details";
import { ErrorMapper } from "http-problem-details-mapper";

export class NotFoundErrorMapper extends ErrorMapper {
  constructor() {
    super(NotFoundError);
  }

  mapError(error: Error) {
    return new ProblemDocument({
      status: 404,
      title: error.message,
      type: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404",
    });
  }
}
