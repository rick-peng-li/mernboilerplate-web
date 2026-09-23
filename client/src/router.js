import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute';
import AppLayout from '@/layouts/AppLayout';
import ActivityPage from '@/pages/ActivityPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectWorkspacePage from '@/pages/ProjectWorkspacePage';
import RegisterPage from '@/pages/RegisterPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
import TasksPage from '@/pages/TasksPage';
import TeamPage from '@/pages/TeamPage';

const router = createBrowserRouter([
    {
        element: createElement(PublicOnlyRoute),
        children: [
            {
                path: '/login',
                element: createElement(LoginPage),
            },
            {
                path: '/register',
                element: createElement(RegisterPage),
            },
        ],
    },
    {
        element: createElement(ProtectedRoute),
        children: [
            {
                path: '/',
                element: createElement(AppLayout),
                children: [
                    {
                        index: true,
                        element: createElement(DashboardPage),
                    },
                    {
                        path: 'projects',
                        element: createElement(ProjectsPage),
                    },
                    {
                        path: 'projects/:projectId',
                        element: createElement(ProjectWorkspacePage),
                    },
                    {
                        path: 'tasks',
                        element: createElement(TasksPage),
                    },
                    {
                        path: 'team',
                        element: createElement(TeamPage),
                    },
                    {
                        path: 'releases',
                        element: createElement(ReleasesPage),
                    },
                    {
                        path: 'activity',
                        element: createElement(ActivityPage),
                    },
                    {
                        path: 'analytics',
                        element: createElement(AnalyticsPage),
                    },
                    {
                        path: 'settings',
                        element: createElement(SettingsPage),
                    },
                ],
            },
        ],
    },
]);

export default router;
