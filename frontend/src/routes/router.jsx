import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { LivePage } from '@/pages/LivePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { YouTubePage } from '@/pages/YouTubePage';
import { BreakingNewsPage } from '@/pages/BreakingNewsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';
import { RequireAuth } from '@/components/common/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { 
        index: true, 
        element: (
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'calendar', 
        element: (
          <RequireAuth>
            <CalendarPage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'youtube', 
        element: (
          <RequireAuth>
            <YouTubePage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'breaking', 
        element: (
          <RequireAuth>
            <BreakingNewsPage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'category/:slug', 
        element: (
          <RequireAuth>
            <CategoryPage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'article/:slug', 
        element: (
          <RequireAuth>
            <ArticlePage />
          </RequireAuth>
        ) 
      },
      { 
        path: 'live/:slug', 
        element: (
          <RequireAuth>
            <LivePage />
          </RequireAuth>
        ) 
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'auth/callback', element: <OAuthCallbackPage /> },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        )
      }
    ],
    errorElement: <NotFoundPage />
  }
]);

