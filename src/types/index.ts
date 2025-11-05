export interface Task {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string; // 마감일
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  context?: string;
  project?: string;
  source: 'manual' | 'git';
  git_commit_sha?: string;
  git_commit_message?: string;
  ai_analyzed: boolean;
  estimated_duration?: number;
  actual_duration?: number;
  started_at?: string;
  ended_at?: string;
  is_timer_running?: boolean;
}

export interface Review {
  id: string;
  period: 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  summary: string;
  insights: string[];
  task_count: number;
  completion_rate: number;
  generated_at: string;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  files_changed: string[];
}

export interface AIAnalysis {
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context: string;
  estimated_duration?: number;
}

export type ViewMode = 'calendar' | 'timeline' | 'dashboard' | 'list' | 'graph' | 'spreadsheet';
