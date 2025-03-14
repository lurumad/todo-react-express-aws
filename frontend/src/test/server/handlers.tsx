import { delay, http, HttpResponse } from "msw";
import { TodoEntity } from "@/pods/list/model";

const todos = [
  { id: "1234", text: "Todo 1", status: "pending" },
  { id: "2345", text: "Todo 2", status: "pending" },
  { id: "3456", text: "Todo 3", status: "completed" },
];

export const handlers = [
  http.get("/todos", async () => {
    if (process.env.NODE_ENV !== "test") {
      await delay(200);
    }
    return HttpResponse.json(todos);
  }),
  http.post("/todos", async ({ request }) => {
    const todo = (await request.json()) as TodoEntity;
    todos.push(todo);
    await delay(500);
    return new Response(null, { status: 201 });
  }),
  http.delete("/todos/:id", async ({ params }) => {
    const { id } = params;
    const index = todos.findIndex((todo) => todo.id === id);
    todos.splice(index, 1);
    await delay(500);
    return new Response(null, { status: 204 });
  }),
  http.put("/todos/:id", async ({ params, request }) => {
    const { id } = params;
    const todo = (await request.json()) as TodoEntity;
    const index = todos.findIndex((todo) => todo.id === id);
    todos[index] = todo;
    await delay(100);
    return HttpResponse.json(todo);
  }),
];
