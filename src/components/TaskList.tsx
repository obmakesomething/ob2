import React from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-light-text-tertiary dark:text-dark-text-tertiary mb-0">
          No tasks found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
