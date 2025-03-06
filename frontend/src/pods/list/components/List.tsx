import React from "react";
import { Todo } from "./Todo";
import { TodoEntity } from "../model";

interface ListProps {
  todos: TodoEntity[];
}

export const List = ({ todos }: ListProps) => {
  return (
    <ul>
      {todos.map((todo) => {
        return <Todo key={todo.id} todo={todo} />;
      })}
    </ul>
  );
};
