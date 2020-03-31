const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: (args) => {
        return User.findOne({email: args.userInput.email}).then(user => {
            if(user){
                throw new Error("user exist");
            }

            return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashPass => {
            const user = new User({
                email: args.userInput.email,
                password: hashPass
            });

            return user.save();
        })
        .then( res => {
            return { ...res._doc, password: null, _id: res.id }
        })
        .catch(err => {throw err})
    },
    login: async ({email, password}) => {
        console.log('here')
        const user = await User.findOne({email: email});
        console.log(user)
        if(!user) {
            throw new Error("User doesn't exist");
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            throw new Error("password is incorrect");
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        },
            'somesecretkey',
        {
            expiresIn: '1h'
        });

        return {
           userId: user.id,
           token: token,
           tokenExpiration: 1
        }
    }
};
