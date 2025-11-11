import { format, startOfDay, endOfDay } from 'date-fns';
import { supabase } from './supabase';
import { generateReview } from './claude';
import type { Task } from '@/types';

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
  const start = startOfDay(date).toISOString();
  const end = endOfDay(date).toISOString();

  // Check if Supabase is available
  if (!supabase) {
    return {
      date: dateStr,
      summary: 'Daily reviews require Supabase configuration.',
      insights: ['Enable Supabase to use daily review features.'],
      total_tasks: 0,
      completed_tasks: 0,
      total_time_spent: 0,
      time_by_project: {},
      time_by_tag: {},
      suggestions: [],
    };
  }

  // Get tasks for the day
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end);

  if (error) throw error;

  if (!tasks || tasks.length === 0) {
    return {
      date: dateStr,
      summary: 'No tasks recorded for today.',
      insights: ['Consider planning tasks for tomorrow.'],
      total_tasks: 0,
      completed_tasks: 0,
      total_time_spent: 0,
      time_by_project: {},
      time_by_tag: {},
      suggestions: ['Plan your tasks for tomorrow to stay organized.'],
    };
  }

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length;
  const totalTimeSpent = tasks.reduce(
    (sum: number, t: Task) => sum + (t.actual_duration || 0),
    0
  );

  // Group by project
  const timeByProject: Record<string, number> = {};
  tasks.forEach((t: Task) => {
    if (t.project) {
      timeByProject[t.project] = (timeByProject[t.project] || 0) + (t.actual_duration || 0);
    }
  });

  // Group by tags
  const timeByTag: Record<string, number> = {};
  tasks.forEach((t: Task) => {
    t.tags?.forEach((tag: string) => {
      timeByTag[tag] = (timeByTag[tag] || 0) + (t.actual_duration || 0);
    });
  });

  // Generate AI summary and insights
  const aiReview = await generateReview(
    tasks,
    'daily' as any, // Add 'daily' to the type
    start,
    end
  );

  // Generate suggestions
  const suggestions = generateSuggestions(tasks, completedTasks, totalTasks);

  const reviewData: DailyReviewData = {
    date: dateStr,
    summary: aiReview.summary,
    insights: aiReview.insights,
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    total_time_spent: Math.round(totalTimeSpent),
    time_by_project: timeByProject,
    time_by_tag: timeByTag,
    suggestions,
  };

  // Save to database
  if (supabase) {
    await supabase.from('daily_reviews').upsert(reviewData);
  }

  return reviewData;
}

function generateSuggestions(
  tasks: Task[],
  completed: number,
  total: number
): string[] {
  const suggestions: string[] = [];

  // Completion rate suggestion
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  if (completionRate < 50) {
    suggestions.push(
      'Try breaking down tasks into smaller, more manageable pieces for better completion rates.'
    );
  } else if (completionRate === 100) {
    suggestions.push('Perfect completion rate! Consider adding more ambitious goals tomorrow.');
  }

  // Time estimation suggestion
  const tasksWithEstimates = tasks.filter(
    (t) => t.estimated_duration && t.actual_duration
  );
  if (tasksWithEstimates.length > 0) {
    const avgAccuracy =
      tasksWithEstimates.reduce((sum, t) => {
        const accuracy =
          Math.abs(t.estimated_duration! - t.actual_duration!) / t.estimated_duration!;
        return sum + accuracy;
      }, 0) / tasksWithEstimates.length;

    if (avgAccuracy > 0.5) {
      suggestions.push(
        'Your time estimates are off by more than 50%. Try tracking time more carefully to improve estimates.'
      );
    }
  }

  // Priority suggestion
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent');
  if (urgentTasks.length > 3) {
    suggestions.push(
      'You have many urgent tasks. Consider better prioritization to reduce stress.'
    );
  }

  return suggestions;
}

// Schedule daily review
export function scheduleDailyReview(hour: number = 18) {
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(hour, 0, 0, 0);

  if (now > scheduled) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  const timeUntilReview = scheduled.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      await generateDailyReview();
      console.log('Daily review generated successfully');

      // Schedule next day
      scheduleDailyReview(hour);
    } catch (error) {
      console.error('Error generating daily review:', error);
      // Retry in 1 hour
      setTimeout(() => scheduleDailyReview(hour), 60 * 60 * 1000);
    }
  }, timeUntilReview);

  console.log(
    `Daily review scheduled for ${format(scheduled, 'yyyy-MM-dd HH:mm')}`
  );
}

// Get today's review
export async function getTodayReview(): Promise<DailyReviewData | null> {
  if (!supabase) return null;

  const today = format(new Date(), 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('daily_reviews')
    .select('*')
    .eq('date', today)
    .single();

  if (error || !data) return null;

  return data as DailyReviewData;
}
