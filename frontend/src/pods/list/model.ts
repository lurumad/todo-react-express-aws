export interface TodoEntity {
  id: string;
  text: string;
  status: TodoStatus;
}

export enum TodoStatus {
  Pending = "pending",
  Completed = "completed",
}
