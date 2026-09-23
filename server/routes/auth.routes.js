import { Router } from 'express';
import { getCurrentUser, postLogin, postLogout, postRegister } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validate-request.js';
import { asyncHandler } from '../utils/async-handler.js';
import { loginPayloadSchema, registerPayloadSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/register', validateRequest(registerPayloadSchema), asyncHandler(postRegister));
router.post('/login', validateRequest(loginPayloadSchema), asyncHandler(postLogin));
router.get('/me', asyncHandler(authenticate), asyncHandler(getCurrentUser));
router.post('/logout', postLogout);

export default router;
