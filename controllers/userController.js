const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newUser = async (req, res) => {

    // Show error messages from express-validator
    const errors = validationResult(req);

    if( ! errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array()})
    }
    
    // Verify if user already exist
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if(user) {
        return res.status(400).json({ msg: `Usuario con email: ${email} ya existe`});
    }

    // Create a new user
    user = new User(req.body);

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        user.save();
        res.json({msg: 'Usuario creado!'});    
    } catch (error) {
        return res.status(500).json({msg: 'Ocurrio un error, intenta nuevamente'})
    }

    
}