import React, { FC } from 'react';
import moment from 'moment/moment';
import { DepartureInfo, Status } from '../pages/SearchPage';

const JourneyDisplay : FC<{journey: DepartureInfo}> = ({ journey }) => {

    const statusToEmoji: { [key in Status]: string } = {
        normal: '✅',
        delayed: '⏳',
        cancelled: '❌',
        fully_reserved: '🚫',
    };

    const arrival = moment(journey.arrivalTime);
    const departure = moment(journey.departureTime);

    return (
        <div
            className = { 'journeyDisplay' }
        >
            {departure.format('HH:mm')}

            <span className = { 'date' }> {departure.format('DD MMM YY')}</span>

            ➡️

            {arrival.format('HH:mm')}

            <span className = { 'date' }> {departure.format('DD MMM YY')}</span>

            <hr/>

            Status: {statusToEmoji[journey.status]}

            <hr/>

            <b>
                {journey.legs.length === 1 ? 'Direct' : `${journey.legs.length - 1} change`}
            </b>

        </div>
    );
};

export default JourneyDisplay;