import { authClient } from '../lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get token from localStorage safely
const getAuthHeaders = (): HeadersInit => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
  }
  return {
    'Content-Type': 'application/json'
  };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  // If body is FormData (e.g. file upload), do not set Content-Type header so browser sets boundaries
  if (options.body instanceof FormData) {
    if (headers && typeof headers === 'object') {
      const { 'Content-Type': _, ...restHeaders } = headers as any;
      options.headers = restHeaders;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          options.headers = {
            'Authorization': `Bearer ${token}`,
            ...restHeaders
          };
        }
      }
    }
  } else {
    options.headers = headers;
  }

  let response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      try {
        const sessionRes = await authClient.getSession();
        if (sessionRes?.data?.user) {
          const user = sessionRes.data.user;
          const authRes = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id
            })
          });
          const authData = await authRes.json();
          if (authRes.ok && authData.token) {
            localStorage.setItem('token', authData.token);
            
            // Re-bind headers for retry
            const headersCopy = { ...headers } as any;
            headersCopy['Authorization'] = `Bearer ${authData.token}`;
            if (options.body instanceof FormData) {
              const { 'Content-Type': _, ...restHeaders } = headersCopy;
              options.headers = restHeaders;
            } else {
              options.headers = headersCopy;
            }
            
            response = await fetch(`${API_URL}${endpoint}`, options);
          }
        }
      } catch (err) {
        console.error('Error auto-syncing session on 401:', err);
      }
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// API Services Client
export const api = {
  auth: {
    register: (payload: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    google: (payload: any) => apiRequest('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
    getProfile: () => apiRequest('/auth/profile'),
    updateProfile: (payload: any) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) })
  },
  resumes: {
    create: (formData: FormData) => apiRequest('/resumes', { method: 'POST', body: formData }),
    getAll: () => apiRequest('/resumes'),
    getById: (id: string) => apiRequest(`/resumes/${id}`),
    delete: (id: string) => apiRequest(`/resumes/${id}`, { method: 'DELETE' }),
    updateTags: (id: string, tags: string[]) => apiRequest(`/resumes/${id}/tags`, { method: 'PUT', body: JSON.stringify({ tags }) })
  },
  ai: {
    chat: (message: string) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
    getChatHistory: () => apiRequest('/ai/chat'),
    clearChat: () => apiRequest('/ai/chat', { method: 'DELETE' }),
    generateCoverLetter: (payload: any) => apiRequest('/ai/cover-letter', { method: 'POST', body: JSON.stringify(payload) }),
    getCoverLetters: () => apiRequest('/ai/cover-letters'),
    getRecommendations: () => apiRequest('/ai/recommend', { method: 'POST' })
  },
  applications: {
    create: (payload: any) => apiRequest('/applications', { method: 'POST', body: JSON.stringify(payload) }),
    getAll: () => apiRequest('/applications'),
    update: (id: string, payload: any) => apiRequest(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: string) => apiRequest(`/applications/${id}`, { method: 'DELETE' })
  },
  dashboard: {
    getStats: () => apiRequest('/dashboard')
  }
};
