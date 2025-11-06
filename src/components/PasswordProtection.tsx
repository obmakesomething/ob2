import React, { useState, useEffect } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || '웰시댕구야';
const AUTH_KEY = 'task-organizer-auth';

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === APP_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
              <Lock className="w-8 h-8 text-accent-primary" />
            </div>
            <h1 className="text-3xl font-medium mb-2">Task Auto Organizer</h1>
            <p className="text-dark-text-secondary">
              Enter password to access your tasks
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-dark-surface rounded-lg border border-dark-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input w-full"
                  autoFocus
                  autoComplete="current-password"
                />
                {error && (
                  <p className="mt-2 text-sm text-accent-red">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!password}
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Unlock
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-dark-text-tertiary">
            Secure password-protected task management
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
