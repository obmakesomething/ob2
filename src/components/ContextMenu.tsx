import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Trash2,
  Copy,
  Play,
  Pause,
  CheckCircle2,
  Archive,
  AlertCircle,
  Calendar,
  Tag,
} from 'lucide-react';
import type { ContextMenuPosition } from '@/hooks/useContextMenu';
import type { Task } from '@/types';

interface ContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  task: Task | null;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
  onChangeStatus?: (task: Task, status: Task['status']) => void;
  onChangePriority?: (task: Task, priority: Task['priority']) => void;
  onSetDueDate?: (task: Task) => void;
  onManageTags?: (task: Task) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  task,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onChangeStatus,
  onChangePriority,
  onSetDueDate,
  onManageTags,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Position adjustment to keep menu in viewport
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }

      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }, [isOpen, position]);

  if (!task) return null;

  const MenuItem = ({
    icon,
    label,
    onClick,
    danger = false,
    disabled = false,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onClick();
          onClose();
        }
      }}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2 text-sm
        transition-smooth text-left
        ${
          danger
            ? 'text-accent-danger hover:bg-accent-danger/10'
            : disabled
            ? 'text-light-text-quaternary dark:text-dark-text-quaternary cursor-not-allowed'
            : 'hover:bg-light-hover dark:hover:bg-dark-hover'
        }
      `}
    >
      <span className="w-4 h-4">{icon}</span>
      <span>{label}</span>
    </button>
  );

  const MenuDivider = () => (
    <div className="h-px bg-light-border dark:border-dark-border my-1" />
  );

  const MenuGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <div className="px-4 py-2 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-50 min-w-[220px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-xl py-2 overflow-hidden"
          style={{ left: position.x, top: position.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Actions */}
          {onEdit && <MenuItem icon={<Edit3 />} label="Edit" onClick={() => onEdit(task)} />}
          {onDuplicate && (
            <MenuItem icon={<Copy />} label="Duplicate" onClick={() => onDuplicate(task)} />
          )}

          <MenuDivider />

          {/* Status */}
          {onChangeStatus && (
            <MenuGroup label="Status">
              {task.status !== 'in_progress' && (
                <MenuItem
                  icon={<Play />}
                  label="Start"
                  onClick={() => onChangeStatus(task, 'in_progress')}
                />
              )}
              {task.status === 'in_progress' && (
                <MenuItem
                  icon={<Pause />}
                  label="Pause"
                  onClick={() => onChangeStatus(task, 'pending')}
                />
              )}
              {task.status !== 'completed' && (
                <MenuItem
                  icon={<CheckCircle2 />}
                  label="Complete"
                  onClick={() => onChangeStatus(task, 'completed')}
                />
              )}
              <MenuItem
                icon={<Archive />}
                label="Archive"
                onClick={() => onChangeStatus(task, 'archived')}
              />
            </MenuGroup>
          )}

          <MenuDivider />

          {/* Priority */}
          {onChangePriority && (
            <MenuGroup label="Priority">
              <MenuItem
                icon={<AlertCircle />}
                label="Urgent"
                onClick={() => onChangePriority(task, 'urgent')}
                disabled={task.priority === 'urgent'}
              />
              <MenuItem
                icon={<AlertCircle />}
                label="High"
                onClick={() => onChangePriority(task, 'high')}
                disabled={task.priority === 'high'}
              />
              <MenuItem
                icon={<AlertCircle />}
                label="Medium"
                onClick={() => onChangePriority(task, 'medium')}
                disabled={task.priority === 'medium'}
              />
              <MenuItem
                icon={<AlertCircle />}
                label="Low"
                onClick={() => onChangePriority(task, 'low')}
                disabled={task.priority === 'low'}
              />
            </MenuGroup>
          )}

          <MenuDivider />

          {/* More Actions */}
          {onSetDueDate && (
            <MenuItem icon={<Calendar />} label="Set Due Date" onClick={() => onSetDueDate(task)} />
          )}
          {onManageTags && (
            <MenuItem icon={<Tag />} label="Manage Tags" onClick={() => onManageTags(task)} />
          )}

          <MenuDivider />

          {/* Danger Zone */}
          {onDelete && (
            <MenuItem icon={<Trash2 />} label="Delete" onClick={() => onDelete(task)} danger />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
