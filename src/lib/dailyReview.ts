import { format } from 'date-fns';

// Daily reviews are disabled without Supabase
// This file is kept for compatibility

interface DailyReviewData {
  date: string;
  summary: string;
  insights: string[];
  total_tasks: number;
  completed_tasks: number;
  total_time_spent: number;
  time_by_project: Record<string, number>;
  time_by_tag: Record<string, number>;
  suggestions: string[];
}

export async function generateDailyReview(
  date: Date = new Date()
): Promise<DailyReviewData> {
  const dateStr = format(date, 'yyyy-MM-dd');

  return {
    date: dateStr,
    summary: 'Daily reviews are currently disabled.',
    insights: ['Enable database to use daily review features.'],
    total_tasks: 0,
    completed_tasks: 0,
    total_time_spent: 0,
    time_by_project: {},
    time_by_tag: {},
    suggestions: [],
  };
}

export function scheduleDailyReview() {
  console.log('Daily review scheduling disabled');
}

export async function getTodayReview(): Promise<DailyReviewData | null> {
  return null;
}
