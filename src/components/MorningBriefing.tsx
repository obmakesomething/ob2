import React, { useState } from 'react';
import { X, Plus, Coffee, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTaskStore } from '@/stores/useTaskStore';
import { formatKoreaTime, isTodayKorea } from '@/utils/koreaTime';
import { motion, AnimatePresence } from 'framer-motion';

interface MorningBriefingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorningBriefing: React.FC<MorningBriefingProps> = ({ isOpen, onClose }) => {
  const { tasks } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 오늘의 할 일 필터링
  const todayTasks = tasks.filter(
    (task) =>
      task.status !== 'completed' &&
      task.status !== 'archived' &&
      (isTodayKorea(task.created_at) || task.priority === 'urgent' || task.priority === 'high')
  );

  const pendingTasks = todayTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = todayTasks.filter((t) => t.status === 'in_progress');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    // TODO: Add task logic
    setNewTaskTitle('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <Card className="bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-light-border dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-primary/10 rounded-xl">
                  <Coffee className="w-6 h-6 text-accent-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-normal mb-1">Good Morning!</h2>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
                    {formatKoreaTime(new Date(), 'EEEE, MMMM d, yyyy · h:mm a')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-smooth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card hover={false} className="bg-light-surface dark:bg-dark-surface">
                <div className="text-center">
                  <div className="text-3xl font-medium mb-1">{todayTasks.length}</div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Total Tasks
                  </div>
                </div>
              </Card>
              <Card hover={false} className="bg-light-surface dark:bg-dark-surface">
                <div className="text-center">
                  <div className="text-3xl font-medium text-accent-primary mb-1">
                    {inProgressTasks.length}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    In Progress
                  </div>
                </div>
              </Card>
              <Card hover={false} className="bg-light-surface dark:bg-dark-surface">
                <div className="text-center">
                  <div className="text-3xl font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                    {pendingTasks.length}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Pending
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Add */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Add Task</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="What do you want to accomplish today?"
                  className="input flex-1"
                />
                <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="max-h-96 overflow-y-auto">
              <h3 className="text-lg font-medium mb-3">Today's Tasks</h3>

              {todayTasks.length === 0 ? (
                <Card hover={false} className="text-center py-8 bg-light-surface dark:bg-dark-surface">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-accent-success" />
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mb-0">
                    No tasks for today. Add some to get started!
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <Card
                      key={task.id}
                      hover={false}
                      className="bg-light-surface dark:bg-dark-surface"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            task.priority === 'urgent'
                              ? 'bg-accent-danger'
                              : task.priority === 'high'
                              ? 'bg-accent-warning'
                              : task.priority === 'medium'
                              ? 'bg-accent-primary'
                              : 'bg-light-text-tertiary dark:bg-dark-text-tertiary'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                task.status === 'in_progress'
                                  ? 'bg-accent-primary/10 text-accent-primary'
                                  : 'bg-light-text-tertiary/10 dark:bg-dark-text-tertiary/10'
                              }`}
                            >
                              {task.status.replace('_', ' ')}
                            </span>
                            {task.estimated_duration && (
                              <span className="flex items-center gap-1 text-light-text-tertiary dark:text-dark-text-tertiary">
                                <Clock className="w-3 h-3" />
                                {task.estimated_duration}m
                              </span>
                            )}
                            {task.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded bg-light-hover dark:bg-dark-hover"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={onClose}>
                Let's Go!
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
