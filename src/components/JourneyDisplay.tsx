import React, { FC, ReactNode } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { IoCheckboxOutline, IoPlayForwardSharp, IoTimerOutline } from 'react-icons/io5';
import { MdGroupOff } from 'react-icons/md';
import moment from 'moment/moment';
import { DepartureInfo, Status } from '../pages/SearchPage';

const JourneyDisplay : FC<{journey: DepartureInfo}> = ({ journey }) => {

    const statusToEmoji: { [key in Status]: ReactNode } = {
        normal: <><IoCheckboxOutline /> normal. </>,
        delayed: <><IoTimerOutline /> This train is <b>delayed</b>. </>,
        cancelled: <><ImCancelCircle /> This train is <b>cancelled</b>. </>,
        fully_reserved: <><MdGroupOff /> This train is <b>sold out</b>. </>,
    };

    const arrival = moment(journey.arrivalTime);
    const departure = moment(journey.departureTime);

    return (
        <div
            className = { 'journey_display' }
        >
            <div className = { 'datetime_container' }>
                {departure.format('HH:mm')}

                <span className = { 'date' }> {departure.format('DD MMM YY')}</span>
            </div>

            <IoPlayForwardSharp />

            <div className = { 'datetime_container' }>
                {arrival.format('HH:mm')}

                <span className = { 'date' }> {departure.format('DD MMM YY')}</span>
            </div>

            {journey.status !== 'normal' &&
                <>
                    <hr/>
                    {statusToEmoji[journey.status]}
                </>}

            <hr/>

            <b>
                {journey.legs.length === 1 ? 'Direct' : `${journey.legs.length - 1} change`}
            </b>

        </div>
    );
};

export default JourneyDisplay;