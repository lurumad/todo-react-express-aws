import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoEntity } from "../model";
import { useProfile } from "@/core";

export const useUpdateTodo = () => {
  const { accessToken } = useProfile();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo: TodoEntity) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/todos/${todo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(todo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
