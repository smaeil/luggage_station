import Bookings from "../models/bookings.js";
import Stations from "../models/stations.js";
import respond from "../middlewares/tools/httpRes.js";
import jarse from "../middlewares/tools/jsonCheckParse.js";
import { uniqueName, uniqueNameHex } from "../middlewares/fileHandling/uniqueName.js";
import { isDate, isDateBefore} from '../middlewares/validation/date.js';
import { isEmail } from '../middlewares/validation/email.js';
import sendEmail from "../middlewares/email/mailer.js";
import bcrypt from 'bcrypt';
import clog from "../middlewares/tools/consoleLog.js";
import fs from 'fs';
import Handlebars from "handlebars";


// global variables like server address
const home = process.env.SERVER_ADDRESS;


// create a booking
export const toBook = async (req, res) => {

    const orderNumber = Number(uniqueName());
    const accessKey = uniqueNameHex();

    try {
        const {fullName, email, phone, station, luggages, from, to} = req.body;

        // validateing the email and the dates:
        if (!isEmail(email)) return respond(res, 400, 'Invalid Email Address');
        if (!(isDate(from) && isDate(to) && isDateBefore(from, to) && isDateBefore(new Date(), from))) {
            return respond(res, 400, 'Date formate or sequence of currency is wrong');
        }

        // check for luggages
        if (!luggages || jarse(luggages).length === 0) return respond(res, 400, 'No luggage was found!');

        // finding and cheking the station
        const luggageStation = await Stations.findOne({_id: station});
        if (!luggageStation) return respond(res, 404, 'Luggage station was not found!');

        // create booking
        // hashing the accesskey
        const hashedAccessKey = bcrypt.hashSync(accessKey, 5);
        await Bookings.create({
            fullName: fullName,
            email: email,
            phone: phone,
            station: station,
            luggages: jarse(luggages),
            from: from,
            to: to,
            orderNumber: orderNumber,
            accessKey: hashedAccessKey
        });


        // sending confirmation email
        const link = home + '/bookings/confirmation/' + orderNumber + '/' + accessKey;

        await sendEmail(email, `Booking Confirmation`, {fullName, link});



        return respond(res, 200, 'Check your email for confirmation link!', {fullName, station: {name: luggageStation.name, email: luggageStation.email, address: luggageStation.address}, orderNumber});
        
        
    } catch (error) {
        await Bookings.findOneAndDelete({orderNumber: orderNumber});
        // clog(error);
        return respond(res, 500, 'Server or Entry error!');
    }
}

// confirmation a booking
const responseHtmlFile = fs.readFileSync('./templates/booking.hbs', 'utf-8');
const responseHtml = Handlebars.compile(responseHtmlFile);

export const confirmation = async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const accessKey = req.params.accessKey;

        // confiramtion time interval in mili second
        const timeInterval = 3600000; // 1 hour

        // finding and checking the booking from orderNumber
        const booking = await Bookings.findOne({orderNumber: orderNumber, confirmed: false, isCancelled: false});
        if (!booking) {
            return res.status(404).send(responseHtml({
                headerColor: '#ff9011',
                title: '404: Booking Was Not Found!',
                text: 'Your booking was not found. it might be remove before confirmation. Please visit the home page and try a new booking!',
                home: home
            }))
        }


        // checking if booking confirmation is expired!
        const now = new Date();
        const bookingTime = new Date(booking.updatedAt);
        const timeDiff = now - bookingTime;
        if (timeDiff > timeInterval) {
            await Bookings.findOneAndDelete({orderNumber: orderNumber});
            return res.status(200).send(responseHtml({
                headerColor: '#f94f4f', 
                title: 'Booking Confirmation Expired!', 
                text: 'You have not confirmed your booking in one hour. Please visit the home page and try a new booking!',
                home: home
            }));
        }


        // cheking the accessKey
        const isMatch = bcrypt.compareSync(accessKey, booking.accessKey);
        if (!isMatch) {
            return respond(res, 401);
        }



        await booking.findOneAndUpdate({orderNumber: orderNumber}, {confirmed: true});

        return res.status(200).send(responseHtml({
            headerColor: '#10ff80',
            title: 'Booking was confirmed',
            text: 'You have successfully confirmed your booking! <br> Thank you for choosing our Services!',
            home: home
        }));

    } catch (error) {
        // clog(error);
        return respond(res, 500);
    }
}

// cancel a booking by client
export const cancellation = async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const accessKey = req.params.accessKey;

        // finding and checking the booking from orderNumber AND && checking if current date of cancellation is before current "to"
        const booking = await Bookings.findOne({orderNumber: orderNumber, isCancelled: false});
        const now = new Date();
        if (!booking && !isDateBefore(now, booking.to)) {
            return res.status(404).send(responseHtml({
                headerColor: '#ff9011',
                title: '404: Booking Was Not Found!',
                text: 'Your booking was not found. it might be remove before confirmation. Please visit the home page and try a new booking!',
                home: home
            }));
        }

        // cheking the accessKey
        const isMatch = bcrypt.compareSync(accessKey, booking.accessKey);
        if (!isMatch) {
            return respond(res, 401);
        }

        await booking.findOneAndUpdate({orderNumber: orderNumber}, {isCancelled: true, cancelledBy: 'Client'});
        
        return res.status(200).send(responseHtml({
            headerColor: '#10ff80',
            title: 'Cancellation was confirmed',
            text: 'You have successfully cancelled your booking! <br> Hope to see you again soon!',
            home: home
        }));

    } catch (error) {
        clog(error);
        return respond(res, 500);
    }
}

// extend a booking
export const extend = async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const accessKey = req.params.accessKey;

        // finding and checking the booking from orderNumber
        const booking = await Bookings.findOne({orderNumber: orderNumber, confirmed: true});
        if (!booking) {
            return res.status(404).send(responseHtml({
                headerColor: '#ff9011',
                title: '404: Booking Was Not Found!',
                text: 'Your booking was not found. it might be remove before confirmation. Please visit the home page and try a new booking!',
                home: home
            }))
        }

        // cheking the accessKey
        const isMatch = bcrypt.compareSync(accessKey, booking.accessKey);
        if (!isMatch) {
            return respond(res, 401);
        }

        // checking the suggested "to" date is after the current "to" date
        if (!isDateBefore(booking.to, to)) {

        }

    } catch (error) {
        clog(error);
        return respond(res, 500);
    }
}


// check a current booking

// view history of bookings