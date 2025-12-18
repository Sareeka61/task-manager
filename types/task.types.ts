export type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string; 
}

export type CreateTaskInput = {
    title: string;
    description: string;
  };

export type TaskFilterStatus = "completed" | "incomplete";
