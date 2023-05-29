import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the ticket router!' });
});

export default router;