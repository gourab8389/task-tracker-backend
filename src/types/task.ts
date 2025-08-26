export interface CreateTaskRequest {
  title: string;
  description?: string;
  useAI?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface AITaskSuggestion {
  title: string;
  description: string;
}
