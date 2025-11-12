import React from 'react';
import { useTaskStore } from '@/stores/useTaskStore';

export const CalendarView: React.FC = () => {
  const { tasks } = useTaskStore();

  return (
    <div className="animate-in">
      <h2 className="mb-4">Calendar View</h2>
      <div className="card p-8 text-center">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Calendar view is currently being rebuilt.
        </p>
        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
          {tasks.length} tasks available
        </p>
      </div>
    </div>
  );
};
