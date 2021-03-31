const Link = require('../models/Link');
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
    const { nombre_original, nombre } = req.body;
    
    const link  = new Link();
    link.url = shortid.generate();
    link.nombre = nombre;
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

// Get Link
exports.getLink = async (req, res, next) => {
    
    const { url } = req.params;
    // Check if link exists
    const link = await Link.findOne({ url: url });
    
    if( ! link ) {
        res.status(404).json({msg: 'El archivo que buscas no existe'});
        return next();
    }

    // If link exists
    res.status(200).json({ file: link.nombre });

    // If number of downloads equeal to 1 Delte file from server
    const { descargas, nombre } = link;
    console.log(descargas);
    if(descargas === 1) {
        
        // Delete file
        req.archivo = nombre;

        // Delete record DB
        await Link.findOneAndRemove(req.params.url)

        next();
    } else {
        // If number of downloads is > to 1 - subtract 1
        console.log('restando');
        link.descargas--;
        await link.save();
    }

    
}