import React, { FC, useState } from 'react';
import moment from 'moment';
import '../style/SearchPage.scss';
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
        <div id = { 'search_page' }>
            <SearchForm submitSearch = { submitSearch } />
            <div id = { 'search_results' }>
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
                                    >
                                        {departure.format('HH:mm')}

                                        <span className = { 'date' }> {departure.format('DD MMM YY')}</span>

                                        ➡️

                                        {origin.format('HH:mm')}

                                        <span className = { 'date' }> {departure.format('DD MMM YY')}</span>

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
                        <div className = { 'loader' }>
                            Loading...
                        </div> :
                        <div className = { 'await_input' }>
                            Select the origin and destination and press search!
                        </div>
                }
            </div>
        </div>
    );
};

export default SearchPage;
