const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 50,
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    likes: { 
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    comments: [{
        comment: {type: String, max:200},
        userId : {type: String},
        createdAt: {type: Date,
            immutable: true,
            default: () => Date.now()
        }
    }]
});

// post hooks
postSchema.post('save', function(doc, next){
    // console.log('New Post was Created\n', doc);
    next();
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;