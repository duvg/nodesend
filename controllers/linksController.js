const Link = require('../models/Link');
const User = require('../models/User');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next)  => {
    
    // Show error messages from express-validator
    const errors = validationResult(req);

    if( ! errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array()})
    }

    // Create Link object
    const { nombre_original } = req.body;
    
    const link  = new Link();
    link.url = shortid.generate();
    link.nombre = shortid.generate();
    link.nombre_original = nombre_original;
    
    
    // if user is authenticated
    if(req.user) {
        const { password, descargas } = req.body;

        // Add number of downloads to the link
        if(descargas) {
            link.descargas = descargas;
        }
        // Add password to link
        if(password) {
            const salt = await bcrypt.genSalt(10);
            
            link.password = await bcrypt.hash( password.toString(), salt);
        }

        // Add author
        link.autor = req.user.id;
    }

    // Save link in database
    try {
        await link.save();
        res.status(201).json({msg: `${link.url}`});
        return next();
    } catch (error) {
        console.log(error);
        res.status(500).json('Ocurrio un error intenta nuevamente');
    }

}