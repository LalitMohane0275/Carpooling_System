const jwt = require('jsonwebtoken')
require("dotenv").config();


const verifyToken = (req, res, next) => {
    try {
        // extract jwt token
        console.log(req.body.token);
        const token = req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success:false,
                message: "Token missing"
            })
        }

        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(e){
            return res.status(401).json({
                success:false,
                message: 'token is invalid'
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message: " Something went wrong, while verifying the token"
        })
    }
};

module.exports = { verifyToken };