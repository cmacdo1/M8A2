// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Creates and defines User Schema and generates JWT
// ***************************************************************

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Loan = require('./loans').schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'You must provide a name'],
        unique: true,
        trim: true,
        maxlength: [20, 'The name cannot be more than 20 characters'],
        minlength: [5, 'The name cannot be less than 5 characters'],
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        validate: {
            validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
            message: (props) => `${props.value} is not a valid email address`,
        }
    },
    password: {
        type: String,
        // required: true
    },
    confirmPassword: {
        type: String,
        // required: true,
        validate: { // This is for comparing the password and confirm password
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    phone: {
        type: String,
        validate: {
            validator: (value) => /^\d{3}-\d{3}-\d{4}$/.test(value),
            message: (props) => `${props.value} is not a valid phone number`,
        }
    },
    address: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        trim: true,
        validate: {
            validator: (value) => value <= Date.now(),
            message: 'Date of Birth must be in the past'
        }
    },
    gender: {
        type: String,
        enum: ['male', 'Male', 'female', 'Female'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    loans: [Loan],
});

// This function will run before the user is saved to the database
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
        this.confirmPassword = undefined // This is so that it does not store in the database
    }
    next();
});

// This function generates the token
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.TOKEN_SECRET_KEY);
        // this.tokens = this.tokens.concat({token: token});
        // await this.save();
        return token;
    } catch(error) {
        console.log(error);
    }
}

// This function will compare the password
userSchema.methods.verifyPassword = async function(password){
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

// This function finds the user in the database
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

const User = mongoose.model('User', userSchema);
module.exports = User;