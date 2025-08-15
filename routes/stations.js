import express from 'express';

const router = express.Router();
import uploadHandler from '../middlewares/fileHandling/uploadHandler.js';

const upload = uploadHandler('./media');


// controllers
import { newStation, editStation, changeMyProfile, changePassword, addStationImages, deleteStationImages, getStations } from '../controllers/stations.js';

// get stations
router.get('/', getStations);

//create stations
router.put('/admin/new-station',upload.fields([{name: 'profile', maxCount: 1}, {name: 'stationImages', maxCount: 10}]), newStation);

// edit station by admin
router.patch('/admin/edit-station/:id', upload.none(),  editStation);

// password change by admin
router.patch('/admin/change-password/:id', upload.none(), changePassword);

// edit station by owner
router.patch('/my-station/edit', upload.none(), editStation);

// change password by user
router.patch('/my-station/change-password', upload.none(), changePassword);

//change profile picture
router.patch('/change-profile', upload.single('profile'), changeMyProfile);

// add station's image
router.put('/my-station/images', upload.array('stationImages'), addStationImages);

// delete station images
router.delete('/my-station/images', upload.none(), deleteStationImages);

export default router;