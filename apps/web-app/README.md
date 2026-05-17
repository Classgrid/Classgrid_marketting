# Classgrid Web App

A modern Vite + React web application for the Classgrid SaaS platform.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env.local` in the web-app directory with your configuration:

```env
# Sanity CMS
VITE_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01

# API Gateway
VITE_API_GATEWAY_URL=http://localhost:4000
VITE_API_GATEWAY_WS_URL=ws://localhost:4000

# App
VITE_APP_NAME=Classgrid
VITE_APP_ENV=development
```

**Get your Sanity Project ID:**
1. Go to https://manage.sanity.io
2. Select your project
3. Copy the Project ID from the project settings

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Building for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Architecture

### Key Files

- `src/App.tsx` - Main app component with router setup
- `src/router.tsx` - React Router configuration with all routes
- `src/lib/sanity.ts` - Sanity CMS client and GROQ queries
- `src/lib/api.ts` - API Gateway client with axios interceptors
- `src/stores/index.ts` - Zustand global state (auth, CMS, UI)
- `src/main.tsx` - Entry point

### Dependencies

- **React Router** (`react-router-dom`) - Client-side routing
- **Sanity** (`@sanity/client`, `@sanity/image-url`) - CMS integration
- **Axios** - HTTP client with auth interceptors
- **Zustand** - Lightweight state management
- **SWR** - Data fetching with caching
- **Lucide React** - Icon library
- **Socket.io** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework (TODO: configure)

## Routes

### Public Routes
- `/` - Home page
- `/about` - About page
- `/features` - Features page
- `/pricing` - Pricing page
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog post
- `/case-studies` - Case studies page
- `/login` - Login page (guest only)

### Protected Routes (requires authentication)
- `/dashboard` - Main dashboard
- `/dashboard/classes` - Class management
- `/dashboard/students` - Student listing
- `/dashboard/timetable` - Timetable
- `/dashboard/messages` - Chat/messaging
- `/dashboard/notes` - Notes
- `/dashboard/settings` - User settings
- `/dashboard/payment` - Payment management

## State Management (Zustand)

### useAuthStore
```typescript
import { useAuthStore } from './stores/index';

const { authToken, isAuthenticated, user, login, logout } = useAuthStore();
```

### useCmsStore
```typescript
import { useCmsStore } from './stores/index';

const { homePage, blogPosts, caseStudies, setBlogPosts } = useCmsStore();
```

### useUiStore
```typescript
import { useUiStore } from './stores/index';

const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUiStore();
```

## API Integration

The `gateway` object provides typed access to all microservices:

```typescript
import { gateway } from './lib/api';

// Authentication
await gateway.auth.login(email, password);
await gateway.auth.signup(email, password, orgName);

// Organization
await gateway.tenant.getOrganization();
await gateway.tenant.listUsers();

// Chat
await gateway.chat.listConversations();
await gateway.chat.sendMessage(conversationId, content);

// Notes
await gateway.notes.createNote(title, content, tags);
```

## Sanity CMS Integration

Fetch content from Sanity:

```typescript
import { fetchSanity, queries, imageUrl } from './lib/sanity';

// Fetch home page
const homePage = await fetchSanity(queries.homePage);

// Fetch dynamic content
const post = await fetchSanity(queries.blogPostBySlug('my-post'));

// Optimize images
const imageUrlOptimized = imageUrl(image).width(300).height(200).url();
```

## Development Workflow

1. **Environment**: Create `.env.local` with Sanity project ID
2. **Run Dev Server**: `npm run dev`
3. **Choose a route** to start building
4. **Components**: Create reusable React components in `src/components/`
5. **Pages**: Map routes to page components in `src/routes/`
6. **Test**: Build and run production preview with `npm run preview`

## Next Steps

1. **Tailwind Setup**: Configure tailwind/postcss settings for the Vite app
2. **Components**: Build page layouts and components
3. **Error Boundaries**: Add React error boundaries for better error handling
4. **Authentication Flow**: Implement login/signup pages with form validation
5. **API Integration**: Connect to gateway service endpoints
6. **Responsive Design**: Ensure mobile-first responsive layouts
7. **Performance**: Optimize images and lazy-load components

## Troubleshooting

### Sanity connection issues
- Verify `VITE_SANITY_PROJECT_ID` is set correctly in `.env.local`
- Check CORS settings in Sanity: https://manage.sanity.io → API CORS origins
- Ensure localhost and production URLs are added to CORS

### API Gateway connection issues
- Verify gateway is running at `http://localhost:4000`
- Check auth token is being stored in localStorage
- Review API response in browser DevTools Network tab

### Port conflicts
- Change port in `vite.config.js`: `server.port = 5000`
- Gateway default: 4000, change in `.env.local`

## Resources

- [React Router Docs](https://reactrouter.com)
- [Sanity Docs](https://www.sanity.io/docs)
- [Vite Docs](https://vitejs.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com)
