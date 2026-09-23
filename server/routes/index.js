import { Router } from 'express';
import activitiesRoutes from './activities.routes.js';
import analyticsRoutes from './analytics.routes.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import healthRoutes from './health.routes.js';
import projectsRoutes from './projects.routes.js';
import releasesRoutes from './releases.routes.js';
import settingsRoutes from './settings.routes.js';
import tasksRoutes from './tasks.routes.js';
import teamRoutes from './team.routes.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/projects', authenticate, projectsRoutes);
router.use('/tasks', authenticate, tasksRoutes);
router.use('/team', authenticate, teamRoutes);
router.use('/releases', authenticate, releasesRoutes);
router.use('/activities', authenticate, activitiesRoutes);
router.use('/analytics', authenticate, analyticsRoutes);
router.use('/settings', authenticate, settingsRoutes);

export default router;
