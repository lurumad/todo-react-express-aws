import { Todo } from "../entities/model";

export interface TodoRepository {
    add(todo: Todo): Promise<void>;
    list(userId: string): Promise<Todo[]>;
    delete(todo: Todo): Promise<void>;
    get(userId: string, id: string): Promise<Todo | undefined>;
    update(todo: Todo): Promise<void>;
}