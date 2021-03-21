const mongoose = require('mongoose');
require('dotenv').config({ path: 'vars.env'});

const connectDB = async () => {

    try {
        // Conectar a la base de datos
        await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        } );

        console.log("DB connected successfully");

    } catch (error) {
        console.log('Ocurrio un error');
        console.log(error);
        process.exit(1);        
    }
}

module.exports = connectDB;