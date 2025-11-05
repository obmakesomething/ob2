import React, { useMemo } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { format } from 'date-fns';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const TimelineView: React.FC = () => {
  const { tasks } = useTaskStore();

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, typeof tasks>();

    tasks.forEach((task) => {
      const date = task.started_at || task.created_at;
      const dateKey = format(new Date(date), 'yyyy-MM-dd');

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(task);
    });

    // Sort by date (newest first)
    return Array.from(grouped.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 14); // Last 14 days
  }, [tasks]);

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
  };

  return (
    <div className="animate-in">
      <h2 className="mb-4">Timeline View</h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-light-border dark:bg-dark-border" />

        {/* Timeline items */}
        <div className="space-y-8">
          {tasksByDate.map(([date, dateTasks]) => {
            const dateObj = new Date(date);
            const totalTime = dateTasks.reduce(
              (sum, t) => sum + (t.actual_duration || 0),
              0
            );
            const completedCount = dateTasks.filter(
              (t) => t.status === 'completed'
            ).length;

            return (
              <div key={date} className="relative pl-20">
                {/* Date marker */}
                <div className="absolute left-0 top-0">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-white font-medium">
                      {format(dateObj, 'd')}
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">
                      {format(dateObj, 'MMM')}
                    </div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {format(dateObj, 'EEE')}
                    </div>
                  </div>
                </div>

                {/* Date summary */}
                <Card hover={false} className="mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium mb-0">
                      {format(dateObj, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-light-text-secondary dark:text-dark-text-secondary">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {completedCount}/{dateTasks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-light-text-secondary dark:text-dark-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(totalTime)}m</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tasks for this date */}
                <div className="space-y-2">
                  {dateTasks
                    .sort((a, b) => {
                      const aTime = new Date(
                        a.started_at || a.created_at
                      ).getTime();
                      const bTime = new Date(
                        b.started_at || b.created_at
                      ).getTime();
                      return aTime - bTime;
                    })
                    .map((task) => (
                      <Card
                        key={task.id}
                        className="hover:border-accent-primary/50"
                      >
                        <div className="flex items-center gap-3">
                          {/* Priority indicator */}
                          <div
                            className={`w-1 h-12 rounded-full ${priorityColors[task.priority]}`}
                          />

                          {/* Task info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {task.started_at && (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                  {format(
                                    new Date(task.started_at),
                                    'HH:mm'
                                  )}
                                </span>
                              )}
                              {task.completed_at && (
                                <>
                                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    →
                                  </span>
                                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    {format(
                                      new Date(task.completed_at),
                                      'HH:mm'
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                            <h4 className="text-sm font-medium mb-1">
                              {task.title}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {task.project && (
                                <span className="px-2 py-0.5 rounded bg-light-hover dark:bg-dark-hover">
                                  {task.project}
                                </span>
                              )}
                              {task.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded bg-light-hover dark:bg-dark-hover"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Duration */}
                          {task.actual_duration && (
                            <div className="text-right">
                              <div className="text-sm font-medium text-accent-success">
                                {Math.round(task.actual_duration)}m
                              </div>
                            </div>
                          )}

                          {/* Status icon */}
                          {task.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-accent-success flex-shrink-0" />
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
