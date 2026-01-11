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
        element: <HomePage />
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: 'youtube',
        element: <YouTubePage />
      },
      {
        path: 'breaking',
        element: <BreakingNewsPage />
      },
      {
        path: 'category/tag/:tag',
        element: <CategoryPage />
      },
      {
        path: 'category/:slug',
        element: <CategoryPage />
      },
      {
        path: 'article/:slug',
        element: <ArticlePage />
      },
      {
        path: 'live/:slug',
        element: <LivePage />
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

