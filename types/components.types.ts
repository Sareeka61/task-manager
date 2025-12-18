import type { CreateTaskInput, Task } from "./task.types";

export interface TaskFormProps {
    onTaskCreated: (input: CreateTaskInput) => Promise<void>;
    onClose?: () => void;
  }

export interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
}