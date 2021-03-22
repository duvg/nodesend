const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Ingresa un email valido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    userController.newUser
);

module.exports = router;
