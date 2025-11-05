import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="border-b border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal mb-0">Task Auto-Organizer</h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0">
              AI-powered task management with Git integration
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
