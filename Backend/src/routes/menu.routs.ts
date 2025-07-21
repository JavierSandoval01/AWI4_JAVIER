import { Router } from 'express';
import { getMenus, createMenu } from '../controllers/menu.contoller';

const router = Router();

router.get('/', getMenus);
router.post('/', createMenu); // ✅ esta línea permite POST

export default router;