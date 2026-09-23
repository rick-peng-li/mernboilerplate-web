import { Router } from 'express';
import {
    getProjects,
    getProjectsSummary,
    postProject,
    putProject,
    removeProject,
} from '../controllers/project.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { projectPayloadSchema } from '../validators/project.schema.js';

const router = Router();

router.get('/', asyncHandler(getProjects));
router.get('/summary', asyncHandler(getProjectsSummary));
router.post('/', validateRequest(projectPayloadSchema), asyncHandler(postProject));
router.put('/:projectId', validateRequest(projectPayloadSchema), asyncHandler(putProject));
router.delete('/:projectId', asyncHandler(removeProject));

export default router;
