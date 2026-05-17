import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from './stores/index';
import './App.css';

/**
 * Main App Component
 * - Initializes router with React Router
 * - Sets up global state from localStorage on mount
 * - Handles app-level error boundaries (can be added later)
 */
function App() {
  const { isAuthenticated, setError, clearError } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage if needed
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Auth state should already be set from store initialization
      console.log('✓ Auth token found in localStorage');
    }
  }, []);

  useEffect(() => {
    // Auto-clear errors after 5 seconds
    const timer = setInterval(() => {
      clearError();
    }, 5000);

    return () => clearInterval(timer);
  }, [clearError]);

  return <RouterProvider router={router} />;
}

export default App;
