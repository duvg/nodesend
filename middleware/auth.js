const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'vars.env'});

module.exports = (req, res, next) => {
    
    const authHeader = req.get('Authorization');
    
    if(authHeader) {
        // Get Token
        const token  = authHeader.split(' ')[1];

        // Check JWT
        try {

            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
        } catch (error) {
            res.status(401).json({msg: "Invalid token"});
        }
        
    }

    return next();
}