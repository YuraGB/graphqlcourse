const Dataloader = require('dataloader');

const User = require('../../models/user');
const Event = require('../../models/events');
const { dateToString } = require('../../helpers/dates');
const userLoader = new Dataloader((userIds) => {
    return User.find({_id: {$in:userIds}});
});

const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const events = (eventIds) => {
    return Event.find({ _id: {$in: eventIds}})
    .then( events => {
        return events.map( event => {
            return transformEvent(event);
        })
    })
    .catch(err=> {
        throw err
    });
};

const user = (userId) => {
    return userLoader.load(userId.toString())
    .then( user => {
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    })
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.events = events;
exports.user = user;