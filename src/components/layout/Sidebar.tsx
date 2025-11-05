import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  List,
  GitBranch,
  Sparkles,
  Network,
  Table2,
} from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import type { ViewMode } from '@/types';

const menuItems: { icon: React.ReactNode; label: string; view: ViewMode }[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', view: 'dashboard' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Calendar', view: 'calendar' },
  { icon: <Clock className="w-5 h-5" />, label: 'Timeline', view: 'timeline' },
  { icon: <List className="w-5 h-5" />, label: 'List', view: 'list' },
  { icon: <Network className="w-5 h-5" />, label: 'Graph', view: 'graph' },
  { icon: <Table2 className="w-5 h-5" />, label: 'Spreadsheet', view: 'spreadsheet' },
];

export const Sidebar: React.FC = () => {
  const { viewMode, setViewMode } = useTaskStore();

  return (
    <aside className="w-64 border-r border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface h-[calc(100vh-73px)] sticky top-[73px]">
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setViewMode(item.view)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-smooth text-left
                ${
                  viewMode === item.view
                    ? 'bg-accent-primary text-white'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="px-4 mb-3">
            <div className="flex items-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                AI Features
              </span>
            </div>
          </div>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-light-text-secondary dark:text-dark-text-secondary
              hover:bg-light-hover dark:hover:bg-dark-hover
              transition-smooth text-left"
          >
            <GitBranch className="w-5 h-5" />
            <span className="font-medium">Git Sync</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
