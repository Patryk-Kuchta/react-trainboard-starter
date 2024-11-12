import React, { useState } from 'react';
import StationSelect from '../components/StationSelect';

const SearchPage: React.FC = () => {

    const [originStation, setOriginStation] = useState('hi!!!!!!');
    const [destinationStation, setDestinationStation] = useState('helo');

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
            <button type = { 'submit' } onClick = { performSearch }>
                Search...
            </button>
        </div>
    );
};

export default SearchPage;
