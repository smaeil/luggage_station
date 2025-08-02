import Stations from '../models/stations.js';
import deleter from '../middlewares/fileHandling/deleter.js';
import clog from '../middlewares/tools/consoleLog.js';
import respond from '../middlewares/tools/httpRes.js';
import jarse from '../middlewares/tools/jsonCheckParse.js';
import bcrypt from 'bcrypt';


//create stations
export const newStation =  async (req, res) => {

    // checkikng for file uploads
    req.files = Object.keys(req.files).length === 0 ? {profile: null, stationImages: []} : req.files;
    req.files.profile = req.files.profile[0] ?? null;
    req.files.stationImages = req.files.stationImages ?? [];

    const profile = req.files.profile.filename ?? null;
    const stationImages = req.files.stationImages.map(item => item.filename);

    try {

        //check if name or email already exist

        const station = await Stations.find({$or : [
            {name: req.body.name},
            {email: req.body.email}
        ]});

        if (station.length !== 0){
            if (profile) deleter('./media', profile);
            deleter('./media', ...stationImages);
            return respond(res, 409, 'The name or email address has been already taken!');
        }

        const password = bcrypt.hashSync(req.body.password, 10);

        const newStation = await Stations.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: password,
            profile: profile,
            stationImages: stationImages,
            address: req.body.address,
            coordinates: jarse(req.body.coordinates)
        });


        return respond(res, 200, 'New Station is added!');
        
    } catch (error) {

        clog(error); // only in development

        if (profile) deleter('./media', profile);
        deleter('./media', ...stationImages);
        return respond(res, 500);
    }
}


export const editStation = async (req, res) => {

    try {

        // id of the station that is targeted for edit whether edited by itself or admin
        const id = req.params.id ?? req.decoded.id;

        if (!id) return respond(res, 400);

        //check if station does not exist
        const station = await Stations.findOne({_id: id});
        if (!station){
            if (profile) deleter('./media', profile);
            deleter('./media', ...stationImages);
            return respond(res, 404, 'The station was not found!');
        }

        const newStation = await Stations.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            coordinates: jarse(req.body.coordinates)
        });


        return respond(res, 200, 'New Station is added!');
        
    } catch (error) {
        clog(error); // only in development
        return respond(res, 500);
    }
}

export const changeMyProfile = async (req, res) => {
    try {

        if (!req.file.filename) return respond(res, 400);
        
        const station = await Stations.findOne({_id: req.decoded.id});

        if (!station) return respond(res, 404);

        const image2delete = station.profile;

        await Stations.findOneAndUpdate({_id: req.decoded.id}, {profile: req.file.filename});
        deleter('./media', image2delete);

        return respond(res, 200);
        
    } catch (error) {
        return respond(res, 500);
    }
}

export const changePassword = async (req, res) => {
    try {
        paramId = req.params.id;
        selfId = req.decoded.id;

        const newPassword = bcrypt.hashSync(req.body.newPassword, 10);

        if (paramId) {
            const target = await Stations.findOne({_id: paramId});

            if (!target) return respond(res, 404);

            await Stations.findOneAndUpdate({_id: paramId}, {password: newPassword});
            return respond(res, 200);
        }

        const station = await Stations.findOne({_id: selfId});

        if (bcrypt.compareSync(req.body.password, station.password)) {
            await Stations.findOneAndUpdate({_id: selfId}, {password: newPassword});
            return respond(res, 200);
        }

        return respond(res, 409);
    } catch (error) {
        return respond(res, 500);
    }
}


export const addStationImages = async (req, res) => {

    // checkikng for file uploads
    req.files =  req.files ?? [];
    const stationImages = req.files.map(item => item.filename);
    try {

        const station = await Stations.findOne({_id: req.decoded.id});

        const updatedImages = [...station.stationImages, ...stationImages];

        await Stations.findOneAndUpdate({_id: req.decoded.id}, {stationImages: updatedImages});

        return respond(res, 200);
        
    } catch (error) {
        deleter('./media', ...stationImages);
        return respond(res, 500);
    }
}

export const deleteStationImages = async (req, res) => {
    try {
        
        const station = await Stations.findOne({_id: req.decoded.id});

        const updatedImages = station.stationImages.filter(item => !req.body.images2delete.includes(item));

        await Stations.findOneAndUpdate({_id: req.decoded.id}, {stationImages: updatedImages});

        deleter('./media', ...req.body.image2delete);

        return respond(res, 200);
    } catch (error) {
        return respond(res, 500);
    }
}

export const getStations = async (req, res) => {
    try {
        const results = await Stations.find({role: 'station'});

        return respond(res, 200, false, results);
    } catch (error) {
        return respond(res, 500);
    }
}