import React, { FC, ReactNode } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { IoCheckboxOutline, IoPlayForwardSharp, IoTimerOutline } from 'react-icons/io5';
import { MdGroupOff } from 'react-icons/md';
import moment from 'moment';
import { DepartureInfo, Status } from '../pages/SearchPage';

const JourneyDisplay : FC<{journey: DepartureInfo}> = ({ journey }) => {

    const statusToEmoji: { [key in Status]: ReactNode } = {
        normal: (
            <>
                <IoCheckboxOutline /> normal.
            </>
        ),
        delayed: (
            <>
                <IoTimerOutline /> This train is <b>delayed</b>.
            </>
        ),
        cancelled: (
            <>
                <ImCancelCircle /> This train is <b>cancelled</b>.
            </>
        ),
        fully_reserved: (
            <>
                <MdGroupOff /> This train is <b>sold out</b>.
            </>
        ),
    };

    const toOrdinal = (n: number): string => {
        const remainder10 = n % 10;
        const remainder100 = n % 100;

        if (remainder100 >= 11 && remainder100 <= 13) {
            return `${n}th`;
        }

        switch (remainder10) {
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
        }
    };

    const arrival = moment(journey.arrivalTime);
    const departure = moment(journey.departureTime);

    return (
        <div
            className = { 'journey_display' }
        >
            <div className = { 'depart_arrive_container' }>
                <div className = { 'side_container' }>
                    {journey.originStation.crs}

                    <span className = { 'detail' }> {journey.originStation.displayName}</span>
                </div>

                <IoPlayForwardSharp/>

                <div className = { 'side_container' }>
                    {journey.destinationStation.crs}

                    <span className = { 'detail' }> {journey.destinationStation.displayName}</span>
                </div>
            </div>

            <hr/>

            <div className = { 'depart_arrive_container' }>
                <div className = { 'side_container' }>
                    {departure.format('HH:mm')}

                    <span className = { 'detail' }> {departure.format('DD MMM YY')}</span>
                </div>

                <IoPlayForwardSharp/>

                <div className = { 'detail_container' }>
                    {arrival.format('HH:mm')}

                    <span className = { 'detail' }> {arrival.format('DD MMM YY')}</span>
                </div>
            </div>

            {journey.status !== 'normal' &&
                <>
                    <hr/>
                    <span role = "status">
                        {statusToEmoji[journey.status]}
                    </span>
                </>}

            <hr/>

            {journey.legs.length === 1 ?

                <b>
                    Direct
                </b>
                :
                journey.legs.slice(0, -1).map((leg, index) =>
                    <div key = { `leg ${leg.legId}` } className = { 'change_info' }>
                        <i>{toOrdinal(index + 1)} change at</i> {leg.destination.displayName}
                    </div>)
            }

        </div>
    );
};

export default JourneyDisplay;