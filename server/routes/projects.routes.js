import { Router } from 'express';
import {
    getProjectDetail,
    getProjects,
    postProject,
    putProject,
    removeProject,
} from '../controllers/projects.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { projectPayloadSchema } from '../validators/workspace.schema.js';

const router = Router();

router.get('/', asyncHandler(getProjects));
router.get('/:projectId', asyncHandler(getProjectDetail));
router.post('/', validateRequest(projectPayloadSchema), asyncHandler(postProject));
router.put('/:projectId', validateRequest(projectPayloadSchema), asyncHandler(putProject));
router.delete('/:projectId', asyncHandler(removeProject));

export default router;
