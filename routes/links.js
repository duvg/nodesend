const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    linksController.newLink
);

router.get('/:url',
    linksController.getLink,
    fileController.deleteFile
);

module.exports = router;