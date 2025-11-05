import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getTodayReview, generateDailyReview } from '@/lib/dailyReview';

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

export const DailyReview: React.FC = () => {
  const [review, setReview] = useState<DailyReviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    setIsLoading(true);
    try {
      const todayReview = await getTodayReview();
      setReview(todayReview);
    } catch (error) {
      console.error('Error loading review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsGenerating(true);
    try {
      const newReview = await generateDailyReview();
      setReview(newReview);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-light-text-tertiary dark:text-dark-text-tertiary mb-0">
            Loading today's review...
          </p>
        </div>
      </Card>
    );
  }

  if (!review) {
    return (
      <Card>
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent-primary" />
          <h3 className="mb-2">No review yet for today</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Daily reviews are automatically generated at 6 PM, or you can generate one now.
          </p>
          <Button onClick={handleGenerateReview} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Daily Review
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  const completionRate =
    review.total_tasks > 0
      ? Math.round((review.completed_tasks / review.total_tasks) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent-primary" />
          <div>
            <h3 className="mb-0">Daily Review</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
              {format(new Date(review.date), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <Button onClick={handleGenerateReview} disabled={isGenerating} size="sm">
          {isGenerating ? 'Generating...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-success/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent-success" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                Completion Rate
              </p>
              <p className="text-2xl font-medium mb-0">{completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                Tasks Completed
              </p>
              <p className="text-2xl font-medium mb-0">
                {review.completed_tasks}/{review.total_tasks}
              </p>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-warning/10 rounded-lg">
              <Clock className="w-5 h-5 text-accent-warning" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                Time Spent
              </p>
              <p className="text-2xl font-medium mb-0">
                {Math.round(review.total_time_spent / 60)}h{' '}
                {review.total_time_spent % 60}m
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Summary */}
      <Card>
        <div className="flex items-start gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="mb-2">AI Summary</h4>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-0">
              {review.summary}
            </p>
          </div>
        </div>
      </Card>

      {/* Insights */}
      {review.insights.length > 0 && (
        <Card>
          <h4 className="mb-3">Key Insights</h4>
          <ul className="space-y-2">
            {review.insights.map((insight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-light-text-secondary dark:text-dark-text-secondary"
              >
                <span className="text-accent-primary mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Time by Project */}
      {Object.keys(review.time_by_project).length > 0 && (
        <Card>
          <h4 className="mb-3">Time by Project</h4>
          <div className="space-y-2">
            {Object.entries(review.time_by_project)
              .sort(([, a], [, b]) => b - a)
              .map(([project, time]) => (
                <div key={project} className="flex items-center justify-between">
                  <span className="text-sm">{project}</span>
                  <span className="text-sm font-medium">
                    {Math.round(time)}m
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Suggestions */}
      {review.suggestions.length > 0 && (
        <Card className="border-accent-warning/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-accent-warning flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="mb-3">Suggestions for Tomorrow</h4>
              <ul className="space-y-2">
                {review.suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-light-text-secondary dark:text-dark-text-secondary text-sm"
                  >
                    <span className="text-accent-warning mt-1">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
