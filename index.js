const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');

// Create  server
const app = express();

// Connect to DB
connectDB();

// Enable cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors());

// App port
const port = process.env.PORT || 4000;

// Enable ead values from body
app.use( express.json() );

// Enable public folders
app.use( express.static('uploads') );

// Prefix
const api = '/api/v1';

// App routes 
app.use(`${api}/users`, require('./routes/users'));
app.use(`${api}/auth`, require('./routes/auth'));
app.use(`${api}/links`, require('./routes/links'));
app.use(`${api}/files`, require('./routes/files'));

// Start the App
app.listen(port, function  () {
    console.log(`Server online in port ${port}`);
});