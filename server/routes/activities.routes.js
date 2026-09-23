import { Router } from 'express';
import { getActivities } from '../controllers/activities.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/', asyncHandler(getActivities));

export default router;
