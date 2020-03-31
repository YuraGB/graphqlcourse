import React  from 'react';
import './BookingsControls.css';

const BookingsControls = (props) => {
    return (
        <div className='bookings-control'>
            <button className={props.activeOutput === 'list' ? 'active' : ''} onClick={props.onChange.bind(this, 'list')}>list</button>
            <button className={props.activeOutput === 'chart' ? 'active' : ''} onClick={props.onChange.bind(this, 'chart')}>Chart</button>
        </div>
    )
};

export default BookingsControls;