const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose');
const instaSchema = new mongoose.Schema({

    username: String,
    email: String,
    password: String,
    displayPicture: {type: String,
    default: 'placeholder.jpg'
    },
    postImage:{type: String,
        default: 'placeholder.jpg'
        }
});
instaSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user', instaSchema);
module.exports = User;