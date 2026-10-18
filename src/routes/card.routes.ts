import { Router } from 'express';
import { 
  createGiftCard, 
  getGiftCards, 
  buyGiftCard, 
  getMyPurchasedCards, 
  getMyListedCards ,
  getBrands
} from '../controllers/card.controller';

const router = Router();
router.get('/brands', getBrands); // Fetch all brands
router.post('/create', createGiftCard);
router.get('/', getGiftCards);
router.post('/buy', buyGiftCard);
router.get('/my-purchases/:userId', getMyPurchasedCards);
router.get('/my-listings/:userId', getMyListedCards);

export default router;