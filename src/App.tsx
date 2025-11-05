import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/views/DashboardView';
import { CalendarView } from './components/views/CalendarView';
import { TimelineView } from './components/views/TimelineView';
import { ListView } from './components/views/ListView';
import { useTaskStore } from './stores/useTaskStore';
import { useThemeStore } from './stores/useThemeStore';
import { taskService } from './lib/supabase';
import { scheduleDailyReview } from './lib/dailyReview';

function App() {
  const { viewMode, setTasks, setLoading, setError } = useTaskStore();
  const { setTheme } = useThemeStore();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      setTheme(parsed.state.theme);
    }
  }, [setTheme]);

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const tasks = await taskService.getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [setTasks, setLoading, setError]);

  // Schedule daily review (6 PM by default)
  useEffect(() => {
    scheduleDailyReview(18); // 18:00 (6 PM)
  }, []);

  const renderView = () => {
    switch (viewMode) {
      case 'dashboard':
        return <DashboardView />;
      case 'calendar':
        return <CalendarView />;
      case 'timeline':
        return <TimelineView />;
      case 'list':
        return <ListView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}

export default App;
