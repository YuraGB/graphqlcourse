import React from 'react';

const eventItem = props => {
    return (
    <li  className="events_list-item">
        <div>
            <h1>
                {props.title}
            </h1>
            <h2> ${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
        </div>

        <div>
            {props.userId === props.creatorId
                ? <p>You are owner</p>
                : <button className='btn' onClick={props.onDetail.bind(this, props.eventId)} >View Details</button>
            }
        </div>

    </li>)};

export default  eventItem;
