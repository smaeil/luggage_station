import express from 'express';
import respond from '../middlewares/tools/httpRes.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uploadHandler from '../middlewares/fileHandling/uploadHandler.js';

const upload = uploadHandler('./media');

const router = express.Router();

import Stations from '../models/stations.js';

router.post('/', upload.none(), async (req, res) => {
    try {
        const {email, password} = req.body;
        const station = await Stations.findOne({email: email});

        if(!station) return respond(res, 404, 'The email address was not found!');

        const isMatched = await bcrypt.compare(password, station.password);

        if (isMatched) {
            const secret = process.env.SERVER_SECRET;
            const age = process.env.TOKEN_AGE;
            const payload = {id: station._id, role: station.role}
            const token = jwt.sign(payload, secret, {expiresIn: age});

            return respond(res, 200, `Welcome ${station.name}!`, {token});
        }

        return respond(res, 401, 'Wrong Password');

    } catch (error) {
        return respond(res, 500, 'signin error', error);
    }
});


export default router;