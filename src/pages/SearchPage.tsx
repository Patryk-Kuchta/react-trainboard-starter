import React, { useContext, useState } from 'react';
import StationSelect from '../components/StationSelect';
import StationInfoContext from '../contexts/StationInfoContext';

const SearchPage: React.FC = () => {

    const stationInfoContext = useContext(StationInfoContext);

    const [originStation, setOriginStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');

    const performSearch = () => {
        window.location.href = `https://www.lner.co.uk/travel-information/travelling-now/live-train-times/depart/${originStation}/${destinationStation}/#LiveDepResults`;
    };

    return (
        <div>
            <h1>Find you next journey...</h1>
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
                disabled = { stationInfoContext.crsList.includes(originStation) || stationInfoContext.crsList.includes(destinationStation) }
            >
                Search...
            </button>
        </div>
    );
};

export default SearchPage;
