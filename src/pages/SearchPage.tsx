import React, { FC, useState } from 'react';
import moment from 'moment';
import '../style/SearchPage.scss';
import SearchForm from '../components/SearchForm';
import { GetParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

type Status = 'normal' | 'delayed' | 'cancelled' | 'fully_reserved';

type DepartureInfo = {
    departureTime: string;
    arrivalTime: string;
    status: Status;
    legs: {length: number}; // only here to access whether it's direct or not (cast from array)
    isFastestJourney: boolean;
    isOvertaken: boolean;
};

const SearchPage: FC = () => {

    const statusToEmoji: { [key in Status]: string } = {
        normal: '✅',
        delayed: '⏳',
        cancelled: '❌',
        fully_reserved: '🚫',
    };

    const [searchResults, setSearchResults] = useState<FaresResponseType | null>(null);
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);
    const [errorResponse, setErrorResponse] = useState<boolean>(false);

    const submitSearch = async (params : GetParams) => {
        setAwaitingResponse(true);
        setSearchResults(null);
        try {
            const response = await makeGetRequestWithParams('v1/fares', params);
            const body = await response.json();
            setSearchResults(body as FaresResponseType);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setErrorResponse(true);
        } finally {
            setAwaitingResponse(false);
        }
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
                                const arrival = moment(journey.arrivalTime);
                                const departure = moment(journey.departureTime);

                                return (
                                    <div
                                        className = { 'journeyDisplay' }
                                        key = { key }
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
                            })
                        }
                    </> : awaitingResponse? errorResponse?
                        <>
                            Error occurred 😭
                        </>
                        :
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
