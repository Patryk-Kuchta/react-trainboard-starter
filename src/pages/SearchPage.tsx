import React, { useContext, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { Moment } from 'moment/moment';
import FutureDateSelect from '../components/FutureDateSelect';
import StationSelect from '../components/StationSelect';
import { StationInfoContext } from '../contexts/StationInfoContext';

const SearchPage: React.FC = () => {

    const stationInfoContext = useContext(StationInfoContext);

    const [originStation, setOriginStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');
    const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

    const performSearch = () => {
        try {
            window.location.href = `https://www.lner.co.uk/travel-information/travelling-now/live-train-times/depart/${originStation}/${destinationStation}/#LiveDepResults`;
        } catch (error) {
            console.error('Failed to navigate:', error);
        }
    };

    const inputValid = (stationInfoContext.crsList.includes(originStation)
                        && stationInfoContext.crsList.includes(destinationStation)
                        && originStation !== destinationStation
                        && selectedDate);

    return (
        <div
            id = { 'form' }
            style = { { display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto' } }
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

export default SearchPage;
