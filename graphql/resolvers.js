const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');
module.exports = {
    createUser: async function({ userInput }, req) { //use destructuring
        //createUser(args, req) {
        //const email = args.userInput.email;
        //return User.findOne().then() return promise if not using async await

        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-mail is invalid.'}); //add to error array
        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password too short!' }); //add to error array
        }

        //check if theres an error added to the array
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            throw error;
        }
        
        const existingUser = await User.findOne({email: userInput.email});
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });
        const createUser = await user.save();
        return { ...createUser._doc, _id: createUser._id.toString() };
    }
};