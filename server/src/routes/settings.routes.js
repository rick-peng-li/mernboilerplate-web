import { Router } from 'express';
import { getWorkspaceSettings, putWorkspaceSettings } from '../controllers/settings.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { settingsPayloadSchema } from '../validators/workspace.schema.js';

const router = Router();

router.get('/', asyncHandler(getWorkspaceSettings));
router.put('/', validateRequest(settingsPayloadSchema), asyncHandler(putWorkspaceSettings));

export default router;
