// API client for Railway PostgreSQL backend

const API_BASE = '/api';

// Helper function for API calls
async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Task Service
export const taskService = {
  async getTasks() {
    return apiCall('/tasks');
  },

  async createTask(task: any) {
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  async updateTask(id: string, updates: any) {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(id: string) {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Review Service (placeholder for now)
export const reviewService = {
  async getReviews() {
    // To be implemented
    return [];
  },

  async createReview(review: any) {
    // To be implemented
    return review;
  },
};

// Export for compatibility
export const supabase = null;
