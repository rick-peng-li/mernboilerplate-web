import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/', asyncHandler(getAnalytics));

export default router;
