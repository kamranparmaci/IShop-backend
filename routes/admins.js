import express from 'express';
import { checkSuperadmin } from '../controllers/admins.js';

const router = express.Router();

router.get('/exists', checkSuperadmin);

export default router;
