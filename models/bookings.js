import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    fullName: {type: String, required: [true, 'The full name is required!'], trim: true},
    email: {type: String, required: [true, 'The email for the station is required!'], trim: true},
    phone: {type: String},
    station: {type: mongoose.Schema.Types.ObjectId, ref: 'stations', required: [true, 'The sataions of storage is required!']},
    luggages: {type: [String], required: [true, 'The luggage is required!'], enum: ['20kg', '30kg', '40kg']},
    orderNumber: {type: Number, required: [true, 'The order number is required!']},
    approved: {type: Boolean, required: [true, 'The approval is required!'], default: false},
    from: {type: Date, required: [true, 'The starting date is required!']},
    to: {type: Date, required: [true, 'The End date is required!']},
    active: {type: Boolean, required: [true, 'The Activness statues is required'], default: true},
    isCancelled: {type: Boolean, required: [true, 'This is required!'], default: false},
    cancelledBy: {type: String, enum: [null, 'Station', 'Client'], default: null},
    accessKey: {type: String, required: [true, 'The access key is required!']}
}, {timestamps: true});

const Bookings = mongoose.model('bookings', bookingSchema);

export default Bookings;