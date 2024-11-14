import React, { FC, useState } from 'react';
import moment from 'moment';
import SearchForm from '../components/SearchForm';
import { getParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

type Status = 'normal' | 'delayed' | 'cancelled' | 'fully_reserved';

type DepartureInfo = {
    departureTime: string;
    arrivalTime: string;
    status: Status;
    legs: {'legId': string }[];
    isFastestJourney: boolean;
    isOvertaken: boolean;
};

const SearchPage: FC = () => {

    const statusToEmoji: Map<Status, string> = new Map([
        ['normal', '✅'],
        ['delayed', '⏳'],
        ['cancelled', '❌'],
        ['fully_reserved', '🚫'],
    ]);

    const [searchResults, setSearchResults] = useState<FaresResponseType | null>(null);
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

    const submitSearch = (params : getParams) => {
        setAwaitingResponse(true);
        setSearchResults(null);
        makeGetRequestWithParams('v1/fares', params).then((response) =>
            response.json()).then((body) => {
            setSearchResults(body as FaresResponseType);
            setAwaitingResponse(false);
        });
    };

    return (
        <div
            id = { 'search_page' }
            style = { { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' } }
        >
            <SearchForm submitSearch = { submitSearch } />
            <div
                style = { { display: 'flex', flexDirection: 'column', margin: '0 auto' } }
            >
                {searchResults?
                    <>
                        <h1>Search Results:</h1>

                        <p>Departure Time ➡️ Arrival Time</p>
                        {
                            searchResults.outboundJourneys.map((journey, key) => {
                                const departure = moment(journey.departureTime);
                                const origin = moment(journey.arrivalTime);

                                return (
                                    <div
                                        className = { 'journeyDisplay' }
                                        key = { key }
                                        style = { { border: 'solid', margin: '0.5em', padding: '0.5em' } }
                                    >
                                        {departure.format('HH:mm')}

                                        <span style = { { fontSize: '0.7em' } }> {departure.format('DD MMM YY')}</span>

                                        ➡️

                                        {origin.format('HH:mm')}

                                        <span style = { { fontSize: '0.7em' } }> {departure.format('DD MMM YY')}</span>

                                        <hr/>

                                        Status: {statusToEmoji.get(journey.status)}

                                        <hr/>

                                        <b>
                                            {journey.legs.length === 1 ? 'Direct' : `${journey.legs.length - 1} change`}
                                        </b>

                                    </div>
                                );
                            })
                        }
                    </> : awaitingResponse?
                        <>
                            Loading...
                        </> :
                        <>
                            Select the origin and destination and press search!
                        </>
                }
            </div>
        </div>
    );
};

export default SearchPage;
