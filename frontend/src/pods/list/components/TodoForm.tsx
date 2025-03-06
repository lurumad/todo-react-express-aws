import React from "react";
import { useForm } from "react-hook-form";
import { useAddTodo } from "../hooks/useAddTodo";
import { TodoEntity, TodoStatus } from "../model";
import { Todo } from "./Todo";

export const TaskForm = () => {
  const { isPending, mutateAsync } = useAddTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: TodoEntity) => {
    data;
    mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="flex">
        <input
          type="text"
          name="text"
          placeholder="Add new task"
          className={`flex-grow border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:border-blue-500 ${
            errors.task ? "border-red-500" : ""
          }`}
          {...register("text", { required: true })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-r-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      {errors.task && (
        <span className="block mt-2 text-red-500 text-sm">
          This field is required
        </span>
      )}
    </form>
  );
};
