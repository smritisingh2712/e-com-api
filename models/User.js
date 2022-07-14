const validator = require('validator')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const UserShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide  a name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide  a email'],
        //we can use match see in job api
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email'

        },


    },
    password: {
        type: String,
        required: [true, 'Please provide  a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

})
UserShema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

});
UserShema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch

}

module.exports = mongoose.model('User', UserShema)