import Bookings from "../models/bookings.js";
import respond from "../middlewares/tools/httpRes.js";
import jarse from "../middlewares/tools/jsonCheckParse.js";
import { uniqueName, uniqueNameHex } from "../middlewares/fileHandling/uniqueName.js";

// create a booking
export const toBook = async (req, res) => {
    try {

        const {fullName, email, phone, station, luggages, from, to} = req.body;
        const orderNumber = Number(uniqueName());
        const accessKey = uniqueNameHex();

        // validateing the email and the dates:
        




        return respond(res, 200,null ,{orderNumber, accessKey});
        
        
    } catch (error) {
        return respond(res, 500, 'Server or Entry error!');
    }
}

// approved a booking
export const approval = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

// cancel a booking

// extend a booking


// check a current booking

// view history of bookings