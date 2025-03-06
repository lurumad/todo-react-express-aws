export type Todo = {
  id: string;
  userId: string;
  text: string;
  status: TodoStatus;
};

export enum TodoStatus {
  Pending = "Pending",
  Completed = "Completed",
}

export interface User {
  userId: string;
  email?: string;
  name?: string;
}
