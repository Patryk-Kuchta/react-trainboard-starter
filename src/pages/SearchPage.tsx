import React, { useContext, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import StationSelect from '../components/StationSelect';
import StationInfoContext from '../contexts/StationInfoContext';

const SearchPage: React.FC = () => {

    const stationInfoContext = useContext(StationInfoContext);

    const [originStation, setOriginStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');

    const performSearch = () => {
        window.location.href = `https://www.lner.co.uk/travel-information/travelling-now/live-train-times/depart/${originStation}/${destinationStation}/#LiveDepResults`;
    };

    const inputValid = stationInfoContext.crsList.includes(originStation) && stationInfoContext.crsList.includes(destinationStation);

    return (
        <div>
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
            <button
                type = { 'submit' }
                onClick = { performSearch }
                disabled = { !inputValid }
                data-tooltip-id = { inputValid? '' : 'invalid-advice-tooltip' }
            >
                Search...
            </button>
            <Tooltip
                id =  'invalid-advice-tooltip'
                place = 'bottom'
                variant = 'info'
                content = 'Please select both valid origin and destination stations.'
            />
        </div>
    );
};

export default SearchPage;
