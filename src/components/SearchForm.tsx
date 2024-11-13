import React, { useContext, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { Moment } from 'moment/moment';
import '../style/SearchForm.scss';
import FutureDateSelect from '../components/FutureDateSelect';
import StationSelect from '../components/StationSelect';
import { StationInfoContext } from '../contexts/StationInfoContext';
import { getParams } from '../helpers/ApiCallHelper';

type SearchFormPrompt = {
    submitSearch: (params: getParams) => void;
}

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
                ['outboundDateTime', selectedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')],
                ['numberOfChildren', '0'],
                ['numberOfAdults', '1']],
            );
        }
    };

    return (
        <div
            id = { 'form' }
        >
            <h1 id = "search-title">Find your next journey...</h1>
            <main role = "main" aria-labelledby = "search-title">
                <h1>Find your next journey...</h1>
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
                <FutureDateSelect
                    setSelectedDate = { setSelectedDate }
                />
                <button
                    type = { 'submit' }
                    onClick = { performSearch }
                    disabled = { !inputValid }
                    data-tooltip-id = { inputValid ? '' : 'invalid-advice-tooltip' }
                >
                    Search...
                </button>
                <Tooltip
                    id = 'invalid-advice-tooltip'
                    place = 'bottom'
                    variant = 'info'
                    content = 'Please select both valid origin and destination stations.'
                />
            </main>
        </div>
    );
};

export default SearchForm;
