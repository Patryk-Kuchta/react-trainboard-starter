import React, { FC, useState } from 'react';
import moment from 'moment';
import SearchForm from '../components/SearchForm';
import { getParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

type DepartureInfo = {
    departureTime: string;
    arrivalTime: string;
    status: 'normal' | 'delayed' | 'cancelled' | 'fully_reserved';
    legs: {'legId': string }[];
    isFastestJourney: boolean;
    isOvertaken: boolean;
};

const SearchPage: FC = () => {

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
            <div>
                {searchResults?
                    <>
                        {
                            searchResults.outboundJourneys.map((journey, key) => {
                                const departure = moment(journey.departureTime);
                                const origin = moment(journey.arrivalTime);

                                return (
                                    <div key = { key }>
                                        {departure.format('HH:mm:')}

                                        {departure.format('DD MMM YY')}

                                        {'->'}

                                        {origin.format('HH:mm:')}

                                        {origin.format('DD MMM YY')}

                                        {'|'}

                                        {journey.status}

                                        {journey.legs.length === 1? 'Direct' : `${journey.legs.length - 1} change`}

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
