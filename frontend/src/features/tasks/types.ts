export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId?: number;
  assigneeId?: number;
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskListResponse {
  content: TaskItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
