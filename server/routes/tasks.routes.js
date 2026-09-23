import { Router } from 'express';
import { getTasks, postTask, putTask, removeTask } from '../controllers/tasks.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { taskPayloadSchema } from '../validators/workspace.schema.js';

const router = Router();

router.get('/', asyncHandler(getTasks));
router.post('/', validateRequest(taskPayloadSchema), asyncHandler(postTask));
router.put('/:taskId', validateRequest(taskPayloadSchema), asyncHandler(putTask));
router.delete('/:taskId', asyncHandler(removeTask));

export default router;
