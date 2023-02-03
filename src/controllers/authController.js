import { Router } from 'express';
import authService from '../services/authService.js';

const router = Router();

router.get('/login', (req, res) => {
    console.log('This is a get operation');
    const token = authService.getSignedToken();
    console.log(token);
    return res.status(200).json(token);
});

export default router;