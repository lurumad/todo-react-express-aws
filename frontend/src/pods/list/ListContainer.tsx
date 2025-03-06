import React from "react";
import { useQuery } from "@tanstack/react-query";
import { List, TaskForm } from "./components";
import { TodoEntity } from "./model";
import { Spinner } from "./components/Spinner";
import { Title } from "./components/Title";
import { useProfile } from "@/core";

export const ListContainer = () => {
  const { data: todos, isLoading, isError } = useGetTodos();

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <Title />
        <TaskForm />
        {isLoading && <Spinner />}
        {isError && <p>There were errors loading todos</p>}
        {!isLoading && !isError && <List todos={todos} />}
      </div>
    </div>
  );
};

const useGetTodos = () => {
  const { accessToken } = useProfile();
  return useQuery<TodoEntity[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      return response.json();
    },
  });
};
