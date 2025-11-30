const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const registrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    // Password will be managed by passport-local-mongoose (hash/salt)
});
registrationSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('Registration', registrationSchema);