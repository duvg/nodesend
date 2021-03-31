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

    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error intenta nuevamente'});
        process.exit(1);        
    }
}

module.exports = connectDB;