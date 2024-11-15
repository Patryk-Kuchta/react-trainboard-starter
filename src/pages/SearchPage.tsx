import React, { FC, useState } from 'react';
import '../style/SearchPage.scss';
import JourneyDisplay from '../components/JourneyDisplay';
import SearchForm from '../components/SearchForm';
import { GetParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

export type Status = 'normal' | 'delayed' | 'cancelled' | 'fully_reserved';

export type DepartureInfo = {
    departureTime: string;
    arrivalTime: string;
    status: Status;
    legs: {length: number}; // only here to access whether it's direct or not (cast from array)
    isFastestJourney: boolean;
    isOvertaken: boolean;
};

const SearchPage: FC = () => {

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
                {searchResults &&
                    <>
                        <h1>Search Results:</h1>

                        <p>Departure Time ➡️ Arrival Time</p>
                        {
                            searchResults.outboundJourneys.map((journey, key) =>
                                <JourneyDisplay journey = { journey } key = { key }/>,
                            )
                        }
                    </>
                }
                {awaitingResponse && !errorResponse &&
                    <>
                        Searching...
                        <div className = { 'loader_container' }>

                            <img className = { 'loader first' } src = { 'train-stripe.png' } alt = { 'Loading...' }>
                            </img>

                            <img className = { 'loader second' } src = { 'train-stripe.png' } alt = { 'Loading...' }>
                            </img>

                        </div>
                    </>

                }
                {errorResponse &&
                    <>
                        Error occurred 😭
                    </>
                }
                {!errorResponse && !awaitingResponse && !searchResults &&
                    <div className = { 'await_input' }>
                        <span>Select the origin and destination and press search!</span>
                        <br/>
                        <i>Your search results will appear here...</i>
                    </div>
                }
            </div>
        </div>
    );
};

export default SearchPage;
