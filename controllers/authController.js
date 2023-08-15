const User = require("../models/User")
const dotEnv = require("dotenv");
dotEnv.config()
const jwt = require('jsonwebtoken')

// create jwt using user id
const maxAge = 24*60*60; // 1 day
const createToken = (id) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ id }, secretKey, {
        expiresIn: maxAge
    })
};

module.exports.signup_post = async(req,res) => {
    const {username, email, password} = req.body;

    try{
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        
        res.cookie('user_jwt', token, { httpOnly: true, maxAge: maxAge*1000})

        res.status(201).json({user: user._id});
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}

module.exports.authenticate_post = async(req,res) => {
    const {email, password} = req.body;
    
    try{
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie('user_jwt', token, { httpOnly: true, maxAge: maxAge*1000})
        
        res.status(200).json({JWT_token: token})
    }
    catch(err){

        res.status(400).json({error: err.message})
    }    
}

module.exports.logout_get = async (req, res) => {
    res.locals.user = null
    res.cookie('user_jwt', '', { maxAge: 1 });
    res.status(200).json("JWToken is Removed")
}