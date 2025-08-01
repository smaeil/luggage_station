import mongoose from "mongoose";

const stationSchema = mongoose.Schema({
    name: {type: String, required: [true, 'the name of the station is required!'], trim: true},
    email: {type: String, required: [true, 'the email for the station is required!'], trim: true},
    phone: {type: String, required: [true, 'the phone number is required for the station']},
    role: {type: String, required: [true, 'The role for station is required'], enum: ['admin', 'station']},
    password: {type: String, required: [true, 'Password is required!']},
    address: {type: String, required: [true, 'the address of the station is required!']},
    location: {type: String, default: "Point"},
    coordinates: [Number],
    status: {type: String, required: [true, 'The status is required for station'], enum: ['Vacant', 'Nearly full', 'Fully booked']}
}, {timestamps: true});

const Stations = mongoose.model('stations', stationSchema);

export default Stations;