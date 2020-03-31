const Booking = require('../../models/booking');
const Event = require('../../models/events');
const { event, user, transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("not Auth")
        }
        try {
            const bookings = await Booking.find({user:req.userId})
            .populate('user')
            .populate('event');
            return bookings.map( booking => {
                return transformBooking(booking);
            })
        }  catch (err){
            console.log("error");
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("not Auth")
        }

        const fetchEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchEvent
        });

        const result = await  booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("not Auth")
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event
        } catch (e) { throw e ;}
    }
};