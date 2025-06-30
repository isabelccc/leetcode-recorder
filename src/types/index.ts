export interface LeetCodeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  url: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
  completedAt?: Date;
  attempts: number;
  notes: string;
  solution: string;
  language: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  failed: number;
  easy: { total: number; completed: number };
  medium: { total: number; completed: number };
  hard: { total: number; completed: number };
  categories: Record<string, { total: number; completed: number }>;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
}

export interface FilterOptions {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
  category?: string;
  tags?: string[];
  search?: string;
}

export interface SortOptions {
  field: 'title' | 'difficulty' | 'status' | 'completedAt' | 'attempts' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface Note {
  id: string;
  problemId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface CodeTemplate {
  language: string;
  template: string;
  name: string;
} 