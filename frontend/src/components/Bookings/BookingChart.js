import React from 'react';
import { Bar } from 'react-chartjs';

const bookingsPakets = {
    'Cheap' : 10,
    'Normal' : 5556,
    'Expencive': 99999
};

const BookingChart = (props) => {


    const outPut= {
        labels: [],
        datasets: []
    };
    let val = [];

    for (const bucket in bookingsPakets) {
        const filt = props.bookings.reduce((prev, current) => {
            if (current.event.price < bookingsPakets[bucket]) {
                return prev + 1;
            } else {
                return prev;
            }

        }, 0);
        val.push(filt);

        outPut.labels.push(bucket);
        outPut.datasets.push({
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: val
        });

        val = [...val]
        val[val.length - 1] = 0;

    }
    return <div style={{textAlign: "center"}}><Bar data={outPut} /></div>;
};

export default  BookingChart;