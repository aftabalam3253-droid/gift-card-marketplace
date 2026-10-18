import { Router } from 'express';
import { getAdminStats, getVerificationQueue, updateCardStatus } from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/verification-queue', getVerificationQueue);
router.post('/update-status', updateCardStatus);

export default router;