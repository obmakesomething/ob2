import React, { useState } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { format } from 'date-fns';
import { Edit3, Check, X } from 'lucide-react';
import type { Task } from '@/types';

export const SpreadsheetView: React.FC = () => {
  const { tasks, updateTask } = useTaskStore();
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (taskId: string, field: string, currentValue: any) => {
    setEditingCell({ taskId, field });
    setEditValue(String(currentValue || ''));
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    const { taskId, field } = editingCell;
    updateTask(taskId, { [field]: editValue });
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const columns = [
    { key: 'title', label: 'Title', width: '250px' },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'priority', label: 'Priority', width: '100px' },
    { key: 'project', label: 'Project', width: '150px' },
    { key: 'tags', label: 'Tags', width: '200px' },
    { key: 'estimated_duration', label: 'Est. Time', width: '100px' },
    { key: 'actual_duration', label: 'Actual Time', width: '100px' },
    { key: 'due_date', label: 'Due Date', width: '120px' },
    { key: 'created_at', label: 'Created', width: '120px' },
  ];

  const getCellValue = (task: Task, key: string) => {
    const value = task[key as keyof Task];

    if (key === 'tags' && Array.isArray(value)) {
      return value.join(', ');
    }

    if ((key === 'created_at' || key === 'due_date') && value) {
      return format(new Date(value as string), 'yyyy-MM-dd');
    }

    if ((key === 'estimated_duration' || key === 'actual_duration') && value) {
      return `${value}m`;
    }

    return value || '-';
  };

  const isEditing = (taskId: string, field: string) => {
    return editingCell?.taskId === taskId && editingCell?.field === field;
  };

  return (
    <div className="animate-in">
      <h2 className="mb-4">Spreadsheet View</h2>

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-light-border dark:border-dark-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left p-3 font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide text-xs"
                  style={{ minWidth: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={task.id}
                className={`
                  border-b border-light-border dark:border-dark-border
                  hover:bg-light-hover dark:hover:bg-dark-hover
                  transition-smooth
                  ${index % 2 === 0 ? 'bg-light-surface dark:bg-dark-surface' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="p-3" style={{ minWidth: col.width }}>
                    {isEditing(task.id, col.key) ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="input py-1 px-2 text-sm flex-1"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 hover:bg-accent-success/10 rounded text-accent-success"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 hover:bg-accent-danger/10 rounded text-accent-danger"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between group cursor-pointer"
                        onClick={() => startEdit(task.id, col.key, task[col.key as keyof Task])}
                      >
                        <span>{getCellValue(task, col.key)}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-smooth" />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-light-text-tertiary dark:text-dark-text-tertiary">
            No tasks to display
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
        Click on any cell to edit. Press Enter to save, Escape to cancel.
      </div>
    </div>
  );
};
