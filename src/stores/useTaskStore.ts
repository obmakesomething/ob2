import { create } from 'zustand';
import { Task, ViewMode } from '@/types';

interface TaskState {
  tasks: Task[];
  viewMode: ViewMode;
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedTask: (task: Task | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  viewMode: 'dashboard',
  selectedTask: null,
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSelectedTask: (task) => set({ selectedTask: task }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
