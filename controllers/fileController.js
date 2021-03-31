const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Link = require('../models/Link');


exports.uploadFile = async (req, res, next) => {

    const configMulter = {
        limits: { fileSize: req.user ? 1024 *1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(
                                                        file.originalname.lastIndexOf('.'), 
                                                        file.originalname.length
                                                    );

                cb(null, `${shortid.generate()}${extension}`);
            },
    
        })
    
    }

    const upload = multer(configMulter).single('file');

    
    upload(req, res, async (error) => {

        if( ! error ) {
            res.status(200).json({file: req.file.filename});
        } else {
            return next();
        } 
    });
    
}

exports.deleteFile = async (req, res) => {

    // Obtener el enlace

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        
    } catch (error) {
        console.log(error);
    }
}

// Descargar un archivo
exports.download = async (req, res, next) => {
    
    const { file } = req.params;
    const link = await Link.findOne({nombre: file });

    const fileDownload = __dirname + '/../uploads/' + file;
    res.download(fileDownload);

    // Eliminar archivo y entrada de la base de datos
     // If number of downloads equeal to 1 Delte file from server
     const { descargas, nombre } = link;
     if(descargas === 1) {
         
         // Delete file
         req.archivo = nombre;
 
         // Delete record DB
         await Link.findOneAndRemove(link.id)
 
         next();
     } else {
         // If number of downloads is > to 1 - subtract 1
         link.descargas--;
         await link.save();
     }

    
}