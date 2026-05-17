import { createBrowserRouter, redirect } from 'react-router-dom';
import { useAuthStore } from './stores/index';

// Placeholder components - will be created next
const Layout = () => <div>Layout Placeholder</div>;
const LoginPage = () => <div>Login Page</div>;
const DashboardLayout = () => <div>Dashboard Layout</div>;
const DashboardPage = () => <div>Dashboard</div>;
const HomePage = () => <div>Home Page</div>;
const AboutPage = () => <div>About Page</div>;
const FeaturesPage = () => <div>Features Page</div>;
const PricingPage = () => <div>Pricing Page</div>;
const BlogPage = () => <div>Blog Page</div>;
const BlogPostPage = () => <div>Blog Post Page</div>;
const CaseStudiesPage = () => <div>Case Studies Page</div>;
const NotFoundPage = () => <div>404 - Not Found</div>;

// Loader functions
const authLoader = async () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (!isAuthenticated) {
    return redirect('/login');
  }
  return null;
};

const guestOnlyLoader = async () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (isAuthenticated) {
    return redirect('/dashboard');
  }
  return null;
};

/**
 * Main application router
 * Structure:
 * - Public routes (/, /about, /features, /pricing, /blog, etc.)
 * - Auth routes (/login, /signup)
 * - Protected routes (/dashboard/*, requires login)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'features',
        element: <FeaturesPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />,
      },
      {
        path: 'case-studies',
        element: <CaseStudiesPage />,
      },
      
      // Auth routes
      {
        path: 'login',
        element: <LoginPage />,
        loader: guestOnlyLoader,
      },
      
      // Protected routes
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: authLoader,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'classes',
            element: <div>Classes Page</div>,
          },
          {
            path: 'students',
            element: <div>Students Page</div>,
          },
          {
            path: 'timetable',
            element: <div>Timetable Page</div>,
          },
          {
            path: 'messages',
            element: <div>Messages Page</div>,
          },
          {
            path: 'notes',
            element: <div>Notes Page</div>,
          },
          {
            path: 'settings',
            element: <div>Settings Page</div>,
          },
          {
            path: 'payment',
            element: <div>Payment Page</div>,
          },
        ],
      },
      
      // 404 fallback
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
