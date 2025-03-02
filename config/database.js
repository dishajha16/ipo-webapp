// config/database.js
const mongoose = require('mongoose');
const dbUri = 'mongodb+srv://vinayst:5OLN0a7MMM0MH3zN@bluestock.8icni.mongodb.net/?retryWrites=true&w=majority&appName=Bluestock';

mongoose.connect(dbUri);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
