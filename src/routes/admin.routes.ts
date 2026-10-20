import { Router } from 'express';
import { 
  getAdminStats, 
  getVerificationQueue, 
  getSellRequests, 
  updateSellRequestStatus 
} from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/verification-queue', getVerificationQueue);
router.get('/sell-requests', getSellRequests);
router.patch('/sell-requests/:id/status', updateSellRequestStatus);

export default router;