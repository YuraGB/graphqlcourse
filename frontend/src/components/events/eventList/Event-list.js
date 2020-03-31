import React from 'react';

import EventItem from './Event-item';

const EventList = props => {
    const list = props.events.map(event => {
        return (<EventItem
            key={event._id}
            title={event.title}
            userId={props.authUserId}
            creatorId={event.creator._id}
            date={event.date}
            eventId={event._id}
            price={event.price}
            onDetail={props.onViewDetails}
            />
    )
    });
    return (
        <ul className="events_list">
            {list}
        </ul>
    );
};

export default EventList;
