export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface TaskListResponse {
  message: string;
  tasks: Task[];
}

export interface TaskResponse {
  message: string;
  task: Task;
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'completed'];
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
