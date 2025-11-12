import type { AIAnalysis, GitCommit } from '@/types';

// Claude AI features are disabled
// API calls should be done server-side for security

export async function analyzeCommit(commit: GitCommit): Promise<AIAnalysis> {
  return {
    tags: ['unclassified'],
    priority: 'medium',
    context: commit.message,
  };
}

export async function analyzeTaskInput(input: string): Promise<{
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  context: string;
  project?: string;
  estimated_duration?: number;
}> {
  return {
    description: input,
    priority: 'medium',
    tags: [],
    context: 'General',
  };
}

export async function generateReview(
  tasks: any[],
  period: 'weekly' | 'monthly',
  startDate: string,
  endDate: string
): Promise<{ summary: string; insights: string[] }> {
  return {
    summary: `${period.charAt(0).toUpperCase() + period.slice(1)} review for ${startDate} to ${endDate}: ${tasks.length} tasks completed.`,
    insights: [
      `Completed ${tasks.length} tasks during this period`,
      'AI review generation is disabled',
    ],
  };
}
