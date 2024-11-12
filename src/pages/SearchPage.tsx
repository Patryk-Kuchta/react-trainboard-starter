import React from 'react';
import hardCodedStations from '../data/hardCodedStations.json';

const SearchPage: React.FC = () => {

    return (
        <div>
            <h1>Find you next journey...</h1>
            <label htmlFor = { 'origin' }>Origin station:</label>
            <select name = { 'origin' } id = { 'origin' }>
                {
                    hardCodedStations.map((station, key) => {
                        return <option value = { station.crs } key = { key }>
                            {station.name}
                        </option>;
                    },
                    )
                }
            </select>
        </div>
    );
};

export default SearchPage;
