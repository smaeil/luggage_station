import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

// handling all routes
import router from './routes/index.js';
app.use('/', router);

//database connection
import {connect} from 'mongoose';
const connectionString = process.env.DB_URI;
connect(connectionString).then(() => console.log('DB connected Successfully!')).catch(err => console.log('DB connection FAILED!'));

//running server
const port = process.env.PORT || 3600;
app.listen(port, () => console.log('the LS app is running on port:', port));