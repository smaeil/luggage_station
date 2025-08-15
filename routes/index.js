import express from 'express';
const router = express.Router();

//home 
router.get('/', (req, res) => res.sendFile('./public/index.html'));


// stations
import stations from './stations.js';
router.use('/stations', stations);

// sign in
import signin from './signin.js';
router.use('/sign-in', signin);

// bookings
import bookings from './bookings.js';
router.use('/bookings', bookings);



// testing the email
import sendEmail from '../middlewares/email/mailer.js';
router.get('/testemail', async (req, res) => {
    try {
        const info = await sendEmail('smaeil.ahmadi@yahoo.com,', 'yooouu hoooo', 'hello my me!');
        return res.status(200).send(info);
    } catch (error) {
       console.log(error);
       return res.status(500).send(error);
    }
});

// handling wrong endpoints : ******************************************************************************
router.use( async (req, res) => {
    console.log(`[ip: ${req.ip}] got wrong Endpoint!: [${req.originalUrl}]`);
    return res.status(404).json({msg: 'Not Found! Wrong Endpoint!'});
});
export default router;