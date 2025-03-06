import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TodoEntity, TodoStatus } from "../model";
import { Todo } from "./Todo";
import { TestProviders } from "@/test/utils";

describe("TodoActive", () => {
  const renderComponent = (todo: TodoEntity) => {
    render(
      <TestProviders>
        <Todo todo={todo} />
      </TestProviders>
    );
  };
  it("render an active todo", () => {
    const todo: TodoEntity = {
      id: "1234",
      text: "Todo 1",
      status: TodoStatus.Pending,
    };
    renderComponent(todo);
    expect(screen.getByTestId("li").textContent).toEqual("Todo 1");
  });

  it("render an active todo with delete button", async () => {
    const todo: TodoEntity = {
      id: "1234",
      text: "Todo 1",
      status: TodoStatus.Pending,
    };
    renderComponent(todo);
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  it("render an active todo completed", () => {
    const todo: TodoEntity = {
      id: "1234",
      text: "Todo 1",
      status: TodoStatus.Completed,
    };
    renderComponent(todo);
    expect(screen.getByTestId(TodoStatus.Completed)).toBeInTheDocument();
  });
});
