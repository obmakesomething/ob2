import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TagManager } from './TagManager';
import { useTaskStore } from '@/stores/useTaskStore';
import { taskService } from '@/lib/supabase';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask } = useTaskStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!task.is_timer_running || !task.started_at) return;

    const interval = setInterval(() => {
      const start = new Date(task.started_at!).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000 / 60); // minutes
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.is_timer_running, task.started_at]);

  const handleStartTimer = async () => {
    try {
      const updates = {
        is_timer_running: true,
        started_at: new Date().toISOString(),
        status: 'in_progress' as const,
      };

      await taskService.updateTask(task.id, updates);
      updateTask(task.id, updates);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handlePauseTimer = async () => {
    try {
      const updates = {
        is_timer_running: false,
      };

      await taskService.updateTask(task.id, updates);
      updateTask(task.id, updates);
    } catch (error) {
      console.error('Error pausing timer:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const updates = {
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        is_timer_running: false,
        ended_at: new Date().toISOString(),
      };

      await taskService.updateTask(task.id, updates);
      updateTask(task.id, updates);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUpdateTags = async (taskId: string, tags: string[]) => {
    try {
      await taskService.updateTask(taskId, { tags });
      updateTask(taskId, { tags });
    } catch (error) {
      console.error('Error updating tags:', error);
      throw error;
    }
  };

  const priorityColors = {
    low: 'text-blue-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const statusColors = {
    pending: 'bg-gray-500/10 text-gray-500',
    in_progress: 'bg-blue-500/10 text-blue-500',
    completed: 'bg-green-500/10 text-green-500',
    archived: 'bg-gray-500/10 text-gray-500',
  };

  return (
    <Card className="hover:border-accent-primary/50">
      <div className="flex items-start gap-4">
        {/* Left: Task info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${priorityColors[task.priority]}`}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Tags and metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}
            >
              {task.status.replace('_', ' ')}
            </span>

            {task.project && (
              <span className="px-2 py-1 rounded text-xs bg-light-hover dark:bg-dark-hover">
                {task.project}
              </span>
            )}

            {task.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setIsTagManagerOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-light-hover dark:bg-dark-hover hover:bg-accent-primary/20 dark:hover:bg-accent-primary/20 transition-smooth"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}

            <button
              onClick={() => setIsTagManagerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-smooth"
            >
              <Plus className="w-3 h-3" />
              {task.tags.length === 0 ? 'Add tags' : 'Manage'}
            </button>

            {task.estimated_duration && (
              <span className="flex items-center gap-1 text-light-text-tertiary dark:text-dark-text-tertiary">
                <Clock className="w-3 h-3" />
                {task.estimated_duration}m estimated
              </span>
            )}

            {task.actual_duration && (
              <span className="flex items-center gap-1 text-accent-success">
                <Clock className="w-3 h-3" />
                {Math.round(task.actual_duration)}m actual
              </span>
            )}
          </div>
        </div>

        {/* Right: Timer and actions */}
        <div className="flex flex-col items-end gap-2">
          {task.is_timer_running && (
            <div className="text-2xl font-medium text-accent-primary">
              {elapsedTime}m
            </div>
          )}

          <div className="flex gap-2">
            {task.status !== 'completed' && (
              <>
                {!task.is_timer_running ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleStartTimer}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePauseTimer}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleComplete}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        task={task}
        onUpdateTags={handleUpdateTags}
      />
    </Card>
  );
};
