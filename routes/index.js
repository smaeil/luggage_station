import express from 'express';
const router = express.Router();

//home 
router.get('/', (req, res) => res.sendFile('./public/index.html'));

export default router;