import React, { FC, useState } from 'react';
import { IoPlayForwardSharp } from 'react-icons/io5';
import '../style/SearchPage.scss';
import JourneyDisplay from '../components/JourneyDisplay';
import SearchForm from '../components/SearchForm';
import { GetParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

export type Status = 'normal' | 'delayed' | 'cancelled' | 'fully_reserved';

type legInfo = {
    origin: {
        displayName: string;
        crs: string;
    };
    destination: {
        displayName: string;
        crs: string;
    };
}

export type DepartureInfo = {
    originStation: {
        displayName: string;
        crs: string;
    };
    destinationStation: {
        displayName: string;
        crs: string;
    };
    departureTime: string;
    departureRealTime: string;
    arrivalTime: string;
    arrivalRealTime: string;
    status: Status;
    legs: legInfo[];
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
                {searchResults?.outboundJourneys &&
                    <>
                        <h1>Search Results:</h1>

                        <div className = { 'journeys_header' } >Departure Time <IoPlayForwardSharp/> Arrival Time</div>
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

                            <img className = { 'loader' } src = { 'loader.png' } alt = { 'Loading...' }>
                            </img>

                        </div>
                    </>

                }
                {errorResponse &&
                    <div className = { 'await_input' }>
                        Error occurred 😭
                    </div>
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
