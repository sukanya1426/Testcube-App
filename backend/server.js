import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import connectDb from './config/DbConfig.js';
import cors from 'cors';
import userRoute from './routes/UserRoute.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport-jwt-strategy.js';
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || '';
const CORS_OPTIONS = {
    origin: process.env.FRONTEND_HOST || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
connectDb(DATABASE_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server in running on port ${PORT}`);
});