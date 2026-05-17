import { create } from 'zustand';

/**
 * Auth Store - Global state for user authentication and tenant context
 * Uses Zustand for lightweight, fast state management
 */
export const useAuthStore = create((set) => ({
  // State
  authToken: localStorage.getItem('authToken') || null,
  tenantId: localStorage.getItem('tenantId') || null,
  userId: localStorage.getItem('userId') || null,
  userRole: localStorage.getItem('userRole') || null,
  user: null,
  organization: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  // Actions
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ authToken: token, isAuthenticated: !!token });
  },

  setTenantId: (id) => {
    if (id) {
      localStorage.setItem('tenantId', id);
    } else {
      localStorage.removeItem('tenantId');
    }
    set({ tenantId: id });
  },

  setUserId: (id) => {
    if (id) {
      localStorage.setItem('userId', id);
    } else {
      localStorage.removeItem('userId');
    }
    set({ userId: id });
  },

  setUserRole: (role) => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
    set({ userRole: role });
  },

  setUser: (user) => set({ user }),

  setOrganization: (org) => set({ organization: org }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  login: (authToken, tenantId, userId, userRole, user) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
    
    set({
      authToken,
      tenantId,
      userId,
      userRole,
      user,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    
    set({
      authToken: null,
      tenantId: null,
      userId: null,
      userRole: null,
      user: null,
      organization: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

/**
 * CMS Content Store - Global state for cached CMS content
 */
export const useCmsStore = create((set) => ({
  // State
  homePage: null,
  aboutPage: null,
  featuresPage: null,
  pricingPage: null,
  blogPosts: [],
  caseStudies: [],
  testimonials: [],
  faqItems: [],
  isLoading: false,
  error: null,

  // Actions
  setHomePage: (page) => set({ homePage: page }),
  setAboutPage: (page) => set({ aboutPage: page }),
  setFeaturesPage: (page) => set({ featuresPage: page }),
  setPricingPage: (page) => set({ pricingPage: page }),
  setBlogPosts: (posts) => set({ blogPosts: posts }),
  setCaseStudies: (studies) => set({ caseStudies: studies }),
  setTestimonials: (testimonials) => set({ testimonials }),
  setFaqItems: (items) => set({ faqItems: items }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

/**
 * UI Store - Global state for UI interactions
 */
export const useUiStore = create((set) => ({
  // State
  sidebarOpen: true,
  mobileMenuOpen: false,
  theme: localStorage.getItem('theme') || 'light',

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));
