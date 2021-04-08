const User = require('../models/User');
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'vars.env'});
const { validationResult } = require('express-validator');

exports.authUser = async (req, res, next) => {
    
    // Show error messages from express-validator
    const errors = validationResult(req);

    if( ! errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array()})
    }

    // Find user
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if( ! user ) {
        res.status(401).json({msg: `Usuario con email: ${email} no existe!`});
        return next();
    }

    // Verify password and auth the user
    if( bcrypt.compareSync(password, user.password) ) {
        // Create JWT
        const token =jwt.sign({
            id: user._id,
            nombre: user.nombre,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: '8h'
        } );

        res.status(200).json({token});

    } else {
        res.status(401).json({msg: "Password incorrecto"});
        return next();
    }
    
}

exports.authenticatedUser = (req, res, next) => {
    
    return res.status(200).json({ 'user': req.user});
}