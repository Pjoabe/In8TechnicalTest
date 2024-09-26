import { Router } from 'express';
import { getProducts, scrapeProducts } from '../controllers/productController';

const router = Router();

router.get('/products', getProducts);
router.post('/scrape', scrapeProducts);

export default router;