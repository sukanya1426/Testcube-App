// const express = require('express');
// const app = express();
// const authRoutes = require('./routes/auth');
// const protectedRoute = require('./routes/protectedRoute');
// app.use(express.json());
// app.use('/auth', authRoutes);
// app.use('/protected', protectedRoute);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// console.log(`Server is running on port ${PORT}`);
// });

import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
const app = express()

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server in running on port ${PORT}`);
});