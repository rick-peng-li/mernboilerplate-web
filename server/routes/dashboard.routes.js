import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/overview', asyncHandler(getDashboardData));

export default router;
