import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const USE_SUPABASE = !!(supabaseUrl && supabaseAnonKey);

if (!USE_SUPABASE) {
  console.warn('Supabase credentials not found. Using localStorage instead.');
}

export const supabase = USE_SUPABASE
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage fallback
const STORAGE_KEY = 'tasks-local-storage';
const REVIEWS_KEY = 'reviews-local-storage';

function getLocalTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalTasks(tasks: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getLocalReviews() {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: any[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Database helper functions
export const taskService = {
  async getTasks() {
    if (!USE_SUPABASE || !supabase) {
      return getLocalTasks();
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return getLocalTasks();
    }
  },

  async createTask(task: any) {
    const newTask = {
      ...task,
      id: task.id || crypto.randomUUID(),
      created_at: task.created_at || new Date().toISOString(),
    };

    if (!USE_SUPABASE || !supabase) {
      const tasks = getLocalTasks();
      tasks.unshift(newTask);
      saveLocalTasks(tasks);
      return newTask;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      const tasks = getLocalTasks();
      tasks.unshift(newTask);
      saveLocalTasks(tasks);
      return newTask;
    }
  },

  async updateTask(id: string, updates: any) {
    if (!USE_SUPABASE || !supabase) {
      const tasks = getLocalTasks();
      const index = tasks.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveLocalTasks(tasks);
        return tasks[index];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      const tasks = getLocalTasks();
      const index = tasks.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveLocalTasks(tasks);
        return tasks[index];
      }
      return null;
    }
  },

  async deleteTask(id: string) {
    if (!USE_SUPABASE || !supabase) {
      const tasks = getLocalTasks();
      const filtered = tasks.filter((t: any) => t.id !== id);
      saveLocalTasks(filtered);
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      const tasks = getLocalTasks();
      const filtered = tasks.filter((t: any) => t.id !== id);
      saveLocalTasks(filtered);
    }
  },
};

export const reviewService = {
  async getReviews() {
    if (!USE_SUPABASE || !supabase) {
      return getLocalReviews();
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return getLocalReviews();
    }
  },

  async createReview(review: any) {
    const newReview = {
      ...review,
      id: review.id || crypto.randomUUID(),
    };

    if (!USE_SUPABASE || !supabase) {
      const reviews = getLocalReviews();
      reviews.unshift(newReview);
      saveLocalReviews(reviews);
      return newReview;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(newReview)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      const reviews = getLocalReviews();
      reviews.unshift(newReview);
      saveLocalReviews(reviews);
      return newReview;
    }
  },
};
