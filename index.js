const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');


// Create  server
const app = express();

// Connect to DB
connectDB();

// App port
const port = process.env.PORT || 4000;

// Enable ead values from body
app.use( express.json() );

// Prefix
const api = '/api/v1';

// App routes 
app.use(`${api}/users`, require('./routes/users'));
app.use(`${api}/auth`, require('./routes/auth'));
app.use(`${api}/links`, require('./routes/links'));


// Start the App
app.listen(port, '0.0.0.0', () => {
    console.log(`Server online in port ${port}`);
});