import { Router } from 'express';
import { 
  getAdminStats, 
  getVerificationQueue, 
  updateCardStatus, 
  getSellRequests, 
  updateSellRequestStatus 
} from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/verification-queue', getVerificationQueue);
router.get('/sell-requests', getSellRequests);
router.patch('/sell-requests/:id/status', updateSellRequestStatus); // Yeh route add karein
router.post('/update-status', updateCardStatus);

export default router;