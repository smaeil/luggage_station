import express from 'express';

const router = express.Router();

import Stations from '../models/stations.js';
import uploadHandler from '../middlewares/fileHandling/uploadHandler.js';
import deleter from '../middlewares/fileHandling/deleter.js';
import clog from '../middlewares/tools/consoleLog.js';
import respond from '../middlewares/tools/httpRes.js';

const upload = uploadHandler('./media');


// controllers
import { newStation, editStation, changeMyProfile, changePassword, addStationImages, deleteStationImages, getStations } from '../controllers/stations.js';

// get stations
router.get('/', getStations);

//create stations
router.put('/admin/new-station',upload.fields([{name: 'profile', maxCount: 1}, {name: 'stationImages', maxCount: 10}]), newStation);

// edit station by admin
router.patch('/admin/edit-station/:id', editStation);

// password change by admin
router.patch('/admin/change-password/:id', changePassword);

// edit station by owner
router.patch('/my-station/edit', editStation);

// change password by user
router.patch('/my-station/change-password', changePassword);

//change profile picture
router.patch('/change-profile', changeMyProfile);

// add station's image
router.put('/my-station/images', addStationImages);

// delete station images
router.delete('/my-station/images', deleteStationImages);

export default router;