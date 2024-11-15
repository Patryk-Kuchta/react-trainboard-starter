import React, { useContext, useState } from 'react';
import { IoSearchCircle } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { Moment } from 'moment/moment';
import '../style/SearchForm.scss';
import FutureDateSelect from '../components/FutureDateSelect';
import StationSelect from '../components/StationSelect';
import { StationInfoContext } from '../contexts/StationInfoContext';
import { GetParams } from '../helpers/ApiCallHelper';

type SearchFormPrompt = {
    submitSearch: (params: GetParams) => void;
}

const DEFAULT_CHILDREN = '0';
const DEFAULT_ADULTS = '1';
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

const SearchForm: React.FC<SearchFormPrompt> = ({ submitSearch }) => {

    const stationInfoContext = useContext(StationInfoContext);

    const [originStation, setOriginStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');
    const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

    const inputValid = (stationInfoContext.crsList.includes(originStation)
        && stationInfoContext.crsList.includes(destinationStation)
        && originStation !== destinationStation
        && selectedDate);

    const performSearch = () => {

        if (inputValid && selectedDate) {
            submitSearch([
                ['originStation', originStation],
                ['destinationStation', destinationStation],
                ['outboundDateTime', selectedDate.format(DATE_FORMAT)],
                ['numberOfChildren', DEFAULT_CHILDREN],
                ['numberOfAdults', DEFAULT_ADULTS]],
            );
        }
    };

    return (
        <form
            id = { 'search_form' }
            onSubmit = { (e) => {
                e.preventDefault();
                performSearch();
            } }
        >
            <h1 id = "search-title">Find your next journey...</h1>
            <main role = "main" aria-labelledby = "search-title">
                <StationSelect
                    label = { 'Origin' }
                    invalidSelections = { [destinationStation] }
                    setSelection = { setOriginStation }
                />
                <StationSelect
                    label = { 'Destination' }
                    invalidSelections = { [originStation] }
                    setSelection = { setDestinationStation }
                />
                <FutureDateSelect setSelectedDate = { setSelectedDate }/>
                <button
                    type = { 'submit' }
                    onClick = { performSearch }
                    disabled = { !inputValid }
                    data-tooltip-id = { inputValid ? '' : 'invalid-advice-tooltip' }
                >
                    <IoSearchCircle/>
                    <span className = { 'title' }>Search...</span>
                </button>
                <Tooltip
                    id = 'invalid-advice-tooltip'
                    place = 'bottom'
                    variant = 'info'
                    content = 'Please select a valid origin, destination and a future date.'
                />
            </main>
        </form>
    );
};

export default SearchForm;
