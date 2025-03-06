import { render, screen } from "@testing-library/react";
import { List } from "./List";
import { TodoEntity, TodoStatus } from "../model";
import { describe, it, expect } from "vitest";
import { TestProviders } from "@/test/utils";

describe("List", () => {
  const renderComponent = (todos: TodoEntity[]) => {
    render(
      <TestProviders>
        <List todos={todos} />
      </TestProviders>
    );
  };

  it("render no todos", () => {
    renderComponent([]);
    // query, get, find
    //  query -> not throws exception if not found
    //  get -> throws exception if not found
    //  find -> returns a promise then there will be a timeout and reject the promise (ex: model popup)
    expect(screen.queryAllByTestId("li").length).toBe(0);
  });

  it("render a single todo", () => {
    renderComponent([
      { id: "1234", text: "Todo 1", status: TodoStatus.Pending },
    ]);

    expect(screen.getByTestId("li").textContent).toEqual("Todo 1");
  });

  it("render the list of todos", () => {
    renderComponent([
      { id: "1234", text: "Todo 1", status: TodoStatus.Pending },
      { id: "2345", text: "Todo 2", status: TodoStatus.Pending },
      { id: "3456", text: "Todo 3", status: TodoStatus.Pending },
    ]);

    expect(screen.getAllByTestId("li").length).toBe(3);
  });
});
