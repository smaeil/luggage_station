import express from 'express';
import uploadHandler from '../middlewares/fileHandling/uploadHandler.js';

const upload = uploadHandler('./media');
const router = express.Router();
import { toBook, confirmation } from '../controllers/bookings.js';

// making new booking
router.put('/new', upload.none(), toBook);

// confirming newly booked
router.get('/confirmation/:orderNumber/:accessKey', confirmation);



export default router;