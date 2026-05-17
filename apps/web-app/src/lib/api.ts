import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:4000';

/**
 * Create axios instance with default config for API Gateway
 */
export const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercept requests to add auth token from localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const tenantId = localStorage.getItem('tenantId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercept responses to handle auth errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth tokens and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * API Gateway service methods
 */
export const gateway = {
  // Authentication endpoints
  auth: {
    login: (email, password) =>
      apiClient.post('/api/auth/login', { email, password }),
    
    signup: (email, password, organizationName) =>
      apiClient.post('/api/auth/signup', {
        email,
        password,
        organizationName,
      }),
    
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      return Promise.resolve();
    },
  },

  // Tenant/Organization endpoints
  tenant: {
    getOrganization: () => apiClient.get('/api/tenant/organization'),
    
    updateOrganization: (data) =>
      apiClient.patch('/api/tenant/organization', data),
    
    listUsers: () => apiClient.get('/api/tenant/users'),
    
    inviteUser: (email, role) =>
      apiClient.post('/api/tenant/users/invite', { email, role }),
    
    removeUser: (userId) =>
      apiClient.delete(`/api/tenant/users/${userId}`),
  },

  // Chat service endpoints
  chat: {
    listConversations: () => apiClient.get('/api/chat/conversations'),
    
    getConversation: (conversationId) =>
      apiClient.get(`/api/chat/conversations/${conversationId}`),
    
    createConversation: (title, participantIds) =>
      apiClient.post('/api/chat/conversations', { title, participantIds }),
    
    sendMessage: (conversationId, content) =>
      apiClient.post(`/api/chat/conversations/${conversationId}/messages`, {
        content,
      }),
    
    listMessages: (conversationId) =>
      apiClient.get(`/api/chat/conversations/${conversationId}/messages`),
  },

  // Payment service endpoints
  payment: {
    createSubscription: (planId) =>
      apiClient.post('/api/payment/subscribe', { planId }),
    
    getSubscription: () => apiClient.get('/api/payment/subscription'),
    
    updatePaymentMethod: (token) =>
      apiClient.post('/api/payment/payment-method', { token }),
    
    listInvoices: () => apiClient.get('/api/payment/invoices'),
    
    getInvoice: (invoiceId) => apiClient.get(`/api/payment/invoices/${invoiceId}`),
  },

  // Notes service endpoints
  notes: {
    listNotes: () => apiClient.get('/api/notes'),
    
    createNote: (title, content, tags = []) =>
      apiClient.post('/api/notes', { title, content, tags }),
    
    getNote: (noteId) => apiClient.get(`/api/notes/${noteId}`),
    
    updateNote: (noteId, title, content, tags) =>
      apiClient.patch(`/api/notes/${noteId}`, { title, content, tags }),
    
    deleteNote: (noteId) => apiClient.delete(`/api/notes/${noteId}`),
  },
};

export default apiClient;
