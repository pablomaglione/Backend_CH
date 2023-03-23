import { Router } from 'express'
import { generateMockProducts } from '../controllers/productsMock.controller.js';

const router = Router();

router.get("/", generateMockProducts);

export { router as productsMockRouter };