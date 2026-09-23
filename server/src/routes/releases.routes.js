import { Router } from 'express';
import { getReleases, postRelease, putRelease, removeRelease } from '../controllers/releases.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { releasePayloadSchema } from '../validators/workspace.schema.js';

const router = Router();

router.get('/', asyncHandler(getReleases));
router.post('/', validateRequest(releasePayloadSchema), asyncHandler(postRelease));
router.put('/:releaseId', validateRequest(releasePayloadSchema), asyncHandler(putRelease));
router.delete('/:releaseId', asyncHandler(removeRelease));

export default router;
