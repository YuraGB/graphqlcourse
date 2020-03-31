const { transformEvent } = require('./merge');
const Event = require('../../models/events');
const User = require('../../models/user');


module.exports = {
    events: () => {
        return Event.find()
        .then(events => {
            return events.map(event => {
                return transformEvent(event);
            })
        }).catch(err => { throw err; });
    },
    createEvent: (args, req) => {
        if(!req.isAuth) {
            throw new Error("not Auth")
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });

        let createdEvent;

        return event.save()
            .then(event  => {
                createdEvent =transformEvent(event);
                return User.findById(req.userId);
            })
            .then(user => {
                if(!user) {
                    throw new Error("user not found");
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then( result => {
                return createdEvent;
            })
            .catch(err => { throw err; });
    },
};