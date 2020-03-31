import React from 'react';
import './Bookings.css';

const Bookings = props => {
    return (
        <React.Fragment>
            <ul className='booking_list'>
                {props.bookings.map(booking =>{
                    return(
                        <li key={booking._id} className='booking_item'>
                            <div className='booking_item-data'>
                                {booking.event.title} - {' '}
                                {booking.event.price} - {' '}
                                {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                            <div className='booking_item-actions'>
                                <button onClick={props.onDelete.bind(this, booking._id)}>
                                    Cancel
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </React.Fragment>
    )
};

export default Bookings;
