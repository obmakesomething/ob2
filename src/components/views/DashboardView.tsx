import React from 'react';
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { QuickInput } from '../QuickInput';
import { Card } from '../ui/Card';
import { TaskList } from '../TaskList';
import { DailyReview } from '../DailyReview';

export const DashboardView: React.FC = () => {
  const { tasks } = useTaskStore();

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  };

  const totalActual = tasks.reduce((sum, t) => sum + (t.actual_duration || 0), 0);

  return (
    <div className="space-y-6 animate-in">
      {/* Quick Input */}
      <div>
        <h2 className="mb-4">Quick Add</h2>
        <QuickInput />
      </div>

      {/* Stats */}
      <div>
        <h2 className="mb-4">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                  In Progress
                </p>
                <p className="text-2xl font-medium mb-0">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-success/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-accent-success" />
              </div>
              <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                  Completed
                </p>
                <p className="text-2xl font-medium mb-0">{stats.completed}</p>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-warning/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-accent-warning" />
              </div>
              <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                  Pending
                </p>
                <p className="text-2xl font-medium mb-0">{stats.pending}</p>
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
                  Total Time
                </p>
                <p className="text-2xl font-medium mb-0">
                  {Math.round(totalActual)}m
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Tasks */}
      <div>
        <h2 className="mb-4">Active Tasks</h2>
        <TaskList
          tasks={tasks.filter(
            (t) => t.status === 'in_progress' || t.status === 'pending'
          )}
        />
      </div>

      {/* Completed Today */}
      <div>
        <h2 className="mb-4">Completed Today</h2>
        <TaskList
          tasks={tasks.filter((t) => {
            if (t.status !== 'completed' || !t.completed_at) return false;
            const completedDate = new Date(t.completed_at);
            const today = new Date();
            return completedDate.toDateString() === today.toDateString();
          })}
        />
      </div>

      {/* Daily Review */}
      <div>
        <h2 className="mb-4">Today's Review</h2>
        <DailyReview />
      </div>
    </div>
  );
};
