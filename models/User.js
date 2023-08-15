const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 30,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    posts:{
        type: Array,
        default: []
    }
});

// post hooks
userSchema.post('save', function(doc, next){
    // console.log('New User was Created\n', doc);
    next();
})

// pre hooks - hash password [this -> instance of user]
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Using Static Method to Authenticate the new User Login
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error("Incorrect Password")
    }
    throw Error('Incorrect Email!')
}

const User = mongoose.model('user', userSchema);

module.exports = User;