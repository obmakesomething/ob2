import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Sparkles } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { taskService } from '@/lib/supabase';
import type { Task } from '@/types';

interface TagColumn {
  tag: string;
  tasks: Task[];
  color: string;
}

export const MultiTagBoard: React.FC = () => {
  const { tasks, updateTask } = useTaskStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverTag, setDragOverTag] = useState<string | null>(null);

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => {
      task.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [tasks]);

  // Generate tag columns
  const tagColumns = useMemo((): TagColumn[] => {
    const colors = [
      'bg-blue-500/10 border-blue-500/30',
      'bg-green-500/10 border-green-500/30',
      'bg-purple-500/10 border-purple-500/30',
      'bg-orange-500/10 border-orange-500/30',
      'bg-pink-500/10 border-pink-500/30',
      'bg-teal-500/10 border-teal-500/30',
    ];

    const columns = allTags.map((tag, index) => ({
      tag,
      tasks: tasks.filter((task) => task.tags.includes(tag)),
      color: colors[index % colors.length],
    }));

    // Add untagged column
    const untaggedTasks = tasks.filter((task) => task.tags.length === 0);
    if (untaggedTasks.length > 0) {
      columns.unshift({
        tag: '_untagged',
        tasks: untaggedTasks,
        color: 'bg-gray-500/10 border-gray-500/30',
      });
    }

    return columns;
  }, [tasks, allTags]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverTag(null);
  };

  const handleDragOver = (e: React.DragEvent, tag: string) => {
    e.preventDefault();
    setDragOverTag(tag);
  };

  const handleDragLeave = () => {
    setDragOverTag(null);
  };

  const handleDrop = async (e: React.DragEvent, targetTag: string) => {
    e.preventDefault();
    setDragOverTag(null);

    if (!draggedTask) return;

    try {
      let newTags: string[];

      if (targetTag === '_untagged') {
        // Remove all tags
        newTags = [];
      } else {
        // Add tag if not already present
        newTags = draggedTask.tags.includes(targetTag)
          ? draggedTask.tags
          : [...draggedTask.tags, targetTag];
      }

      await taskService.updateTask(draggedTask.id, { tags: newTags });
      updateTask(draggedTask.id, { tags: newTags });
    } catch (error) {
      console.error('Error updating task tags:', error);
    }

    setDraggedTask(null);
  };

  const priorityColors = {
    low: 'border-l-blue-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    urgent: 'border-l-red-500',
  };

  const TaskCard: React.FC<{ task: Task; isDragging: boolean }> = ({ task, isDragging }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      draggable
      onDragStart={() => handleDragStart(task)}
      onDragEnd={handleDragEnd}
      className={`
        p-3 rounded-lg border-l-4 ${priorityColors[task.priority]}
        bg-light-surface dark:bg-dark-surface
        border border-light-border dark:border-dark-border
        cursor-grab active:cursor-grabbing
        hover:border-accent-primary/50 transition-smooth
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <h4 className="text-sm font-medium mb-1 line-clamp-2">{task.title}</h4>
      <div className="flex items-center gap-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
        <span className="px-1.5 py-0.5 rounded bg-light-hover dark:bg-dark-hover">
          {task.priority}
        </span>
        {task.project && (
          <span className="px-1.5 py-0.5 rounded bg-light-hover dark:bg-dark-hover">
            {task.project}
          </span>
        )}
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-xs bg-accent-primary/20 text-accent-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="mb-2">Multi-Tag Board</h2>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Drag and drop tasks between tag columns to organize them. Tasks can have multiple tags.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {tagColumns.map((column) => (
          <div
            key={column.tag}
            onDragOver={(e) => handleDragOver(e, column.tag)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.tag)}
            className={`
              flex-shrink-0 w-80 rounded-lg border-2 transition-smooth
              ${column.color}
              ${
                dragOverTag === column.tag
                  ? 'border-accent-primary shadow-lg scale-105'
                  : ''
              }
            `}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {column.tag === '_untagged' ? (
                    <>
                      <Plus className="w-5 h-5" />
                      <h3 className="font-medium">Untagged</h3>
                    </>
                  ) : (
                    <>
                      <Tag className="w-5 h-5 text-accent-primary" />
                      <h3 className="font-medium">{column.tag}</h3>
                    </>
                  )}
                </div>
                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {column.tasks.length}
                </span>
              </div>
              {column.tag !== '_untagged' && (
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Drop tasks here to add this tag
                </p>
              )}
            </div>

            {/* Column Content */}
            <div className="p-3 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
              {column.tasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {dragOverTag === column.tag ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Drop task here
                    </span>
                  ) : (
                    'No tasks'
                  )}
                </div>
              ) : (
                column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggedTask?.id === task.id}
                  />
                ))
              )}
            </div>
          </div>
        ))}

        {/* Add New Tag Column */}
        <div className="flex-shrink-0 w-80 rounded-lg border-2 border-dashed border-light-border dark:border-dark-border bg-light-surface-2/50 dark:bg-dark-surface-2/50 flex items-center justify-center min-h-[200px]">
          <div className="text-center p-6">
            <Plus className="w-8 h-8 mx-auto mb-2 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Add tags to tasks to create new columns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
