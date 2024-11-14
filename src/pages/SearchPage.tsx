import React, { FC, useState } from 'react';
import SearchForm from '../components/SearchForm';
import { getParams, makeGetRequestWithParams } from '../helpers/ApiCallHelper';

type FaresResponseType = {
    outboundJourneys: DepartureInfo[];
}

type DepartureInfo = {
    departureTime: string;
    arrivalTime: string;
    status: string;
};

const SearchPage: FC = () => {

    const [searchResults, setSearchResults] = useState<any>(null); // TODO REMOVE THE ANY IT ONLY A temp!!!

    const submitSearch = (params : getParams) => {
        makeGetRequestWithParams('v1/fares', params).then((response) =>
            response.json()).then((body) => {
            console.log(body);
            setSearchResults(body);
        });
    };

    return (
        <div
            id = { 'search_page' }
            style = { { display: 'flex', flexDirection: 'row' } }
        >
            <SearchForm submitSearch = { submitSearch } />
            <div>
                Loading...
            </div>
        </div>
    );
};

export default SearchPage;
