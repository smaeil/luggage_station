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



// handling wrong endpoints : ******************************************************************************
router.use( async (req, res) => {
    console.log(`[ip: ${req.ip}] got wrong Endpoint!: [${req.originalUrl}]`);
    return res.status(404).json({msg: 'Not Found! Wrong Endpoint!'});
});
export default router;