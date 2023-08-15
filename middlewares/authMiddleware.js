const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async(req, res, next) => {
    const token = req.cookies.user_jwt;

    if(token){
        await jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.status(401).json({error: err.message});
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(401).json({error: "Unauthorized Access!"});
    }
}

const checkUser = async(req, res, next) => {
    const token = req.cookies.user_jwt;

    if(token){
        await jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err){
                res.locals.user = null;
                next();
            }
            else{
                const userId = decodedToken.id;
                let _user = await User.findById(userId);
                res.locals.user = _user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { authenticate, checkUser };