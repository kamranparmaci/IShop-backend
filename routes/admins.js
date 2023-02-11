import express from 'express';
import { checkSuperadmin } from '../controllers/admins';

const router = express.Router();

router.get('/check-superadmin', checkSuperadmin);

export default router;
