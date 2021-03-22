const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Ingresa un email valido').isEmail(),
        check('password', 'El password es requerido').not().isEmpty()
    ],
    authController.authUser
);

router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;