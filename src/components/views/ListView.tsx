import React, { useState, useMemo } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskList } from '../TaskList';
import { Filter } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed';
type SortType = 'date' | 'priority' | 'duration';

export const ListView: React.FC = () => {
  const { tasks } = useTaskStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filter !== 'all') {
      result = result.filter((t) => t.status === filter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'date':
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'duration':
          return (
            (b.actual_duration || b.estimated_duration || 0) -
            (a.actual_duration || a.estimated_duration || 0)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filter, sort]);

  return (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-0">All Tasks</h2>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="input py-1.5 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="input py-1.5 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 text-sm">
        <div>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            Total:{' '}
          </span>
          <span className="font-medium">{filteredAndSortedTasks.length}</span>
        </div>
        <div>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            Pending:{' '}
          </span>
          <span className="font-medium">
            {filteredAndSortedTasks.filter((t) => t.status === 'pending').length}
          </span>
        </div>
        <div>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            In Progress:{' '}
          </span>
          <span className="font-medium">
            {
              filteredAndSortedTasks.filter((t) => t.status === 'in_progress')
                .length
            }
          </span>
        </div>
        <div>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            Completed:{' '}
          </span>
          <span className="font-medium text-accent-success">
            {
              filteredAndSortedTasks.filter((t) => t.status === 'completed')
                .length
            }
          </span>
        </div>
      </div>

      {/* Task list */}
      <TaskList tasks={filteredAndSortedTasks} />
    </div>
  );
};
