import express from 'express';
import uploadHandler from '../middlewares/fileHandling/uploadHandler.js';

const upload = uploadHandler('./media');

const router = express.Router();

import { toBook } from '../controllers/bookings.js';
router.put('/new', upload.none(), toBook);



export default router;