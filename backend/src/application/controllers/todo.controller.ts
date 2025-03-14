import { TodoService as TodoService } from "@/application/services/todo.service";
import { TodoRepository } from "@/domain/repositories/todo.repository";
import { Todo, TodoStatus } from "@/domain/entities/model";
import { Express, NextFunction, Request, Response } from "express";

export const todoController = (app: Express, repository: TodoRepository) => {
  app.post("/todos", asyncHandler(async (req: Request, res: Response) => {
    const todo = req.body as Todo;
    todo.id = crypto.randomUUID();
    todo.userId = req.user.userId;
    todo.status = TodoStatus.Pending;
    const service = new TodoService(repository);
    await service.add(todo);

    res.status(201).json(todo);
  }));

  app.get("/todos", asyncHandler(async (req: Request, res: Response) => {
    const service = new TodoService(repository);
    res.status(200).json(await service.list(req.user.userId));
  }));

  app.delete("/todos/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const service = new TodoService(repository);
    const todo = await service.get(req.user.userId, id);

    if (!todo) {
      res.status(404).send();
      return;
    }

    await service.delete(todo);

    res.status(204).send();
  }));

  app.put("/todos/:id", asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const service = new TodoService(repository);

    const todo = await service.get(req.user.userId, id);

    if (!todo) {
      res.status(404).send();
      return;
    }

    todo.status = req.body.status;
    await service.update(todo);

    res.status(200).json(todo);
  }));

};

function asyncHandler<T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
): (req: T, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
