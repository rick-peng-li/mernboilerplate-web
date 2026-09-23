import { Router } from 'express';
import { getMembers, postMember, putMember, removeMember } from '../controllers/team.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { memberPayloadSchema } from '../validators/workspace.schema.js';

const router = Router();

router.get('/', asyncHandler(getMembers));
router.post('/', validateRequest(memberPayloadSchema), asyncHandler(postMember));
router.put('/:memberId', validateRequest(memberPayloadSchema), asyncHandler(putMember));
router.delete('/:memberId', asyncHandler(removeMember));

export default router;
