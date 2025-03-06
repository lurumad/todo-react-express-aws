import React from "react";
import { TodoEntity, TodoStatus } from "../model";
import { DeleteButton } from "./DeleteButton";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import { useUpdateTodo } from "../hooks/useUpdateTodo";
import { TodoSpinner } from "./TodoSpinner";

interface TodoProps {
  todo: TodoEntity;
}

export const Todo = ({ todo }: TodoProps) => {
  const { isPending: isDeleting, mutateAsync: mutateDeleteAsync } =
    useDeleteTodo();
  const { isPending: isUpdating, mutateAsync: mutateUpdateAsync } =
    useUpdateTodo();

  return (
    <li
      data-testid="li"
      className="flex items-center justify-between border-b border-gray-200 py-3"
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          id="task1"
          className="mr-3 h-5 w-5 text-blue-600"
          checked={todo.status === TodoStatus.Completed}
          onChange={(e) =>
            mutateUpdateAsync({
              ...todo,
              status: e.target.checked
                ? TodoStatus.Completed
                : TodoStatus.Pending,
            })
          }
          data-testid={TodoStatus.Completed}
        />
        <label
          htmlFor="task1"
          className={
            todo.status === TodoStatus.Completed
              ? "text-gray-400 line-through"
              : "text-gray-800"
          }
        >
          {todo.text}
        </label>
      </div>
      <div className="flex items-center space-x-2">
        {(isDeleting || isUpdating) && <TodoSpinner data-testid="loading" />}
        {!isDeleting && !isUpdating && (
          <>
            <DeleteButton
              id={todo.id}
              onClick={async () => mutateDeleteAsync(todo.id)}
            />
          </>
        )}
      </div>
    </li>
  );
};
