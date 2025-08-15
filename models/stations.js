import mongoose from "mongoose";

const stationSchema = mongoose.Schema({
    name: {type: String, required: [true, 'The name of the station is required!'], trim: true},
    email: {type: String, required: [true, 'The email for the station is required!'], trim: true, unique: true},
    phone: {type: String, required: [true, 'The phone number is required for the station!']},
    role: {type: String, required: [true, 'The role for station is required'], enum: ['admin', 'station'], default: 'station'},
    password: {type: String, required: [true, 'Password is required!']},
    profile: {type: String},
    stationImages: [String],
    address: {type: String, required: [true, 'The address of the station is required!']},
    location: {type: String, default: "Point"},
    coordinates: {type: [Number], required: [true, 'The coordinate for luggae station is required!']},
    status: {type: String, required: [true, 'The status is required for station'], enum: ['Vacant', 'Nearly full', 'Fully booked'], default: 'Vacant'}
}, {timestamps: true});

const Stations = mongoose.model('stations', stationSchema);

export default Stations;