import React, { FC } from 'react';
import hardCodedStations from '../data/hardCodedStations.json';

type StationSelectInput = {
    label: string;
    invalidSelections: string[];
    setSelection: (crs: string) => void;
}

const StationSelect : FC<StationSelectInput> = ({ label, invalidSelections, setSelection }) => {
    const elementId = label.toLowerCase();

    return <>
        <label htmlFor = { elementId }>{label} station:</label>
        <select
            name = { elementId }
            id = { elementId }
            onChange = { (event) => {
                setSelection(event.target.value);
            } }
        >
            <option value = "">Select...</option>
            {
                hardCodedStations.map((station, key) => {
                    return (
                        <option
                            value = { station.crs }
                            key = { key }
                            disabled = { invalidSelections.includes(station.crs) }
                        >
                            {station.name}
                        </option>);
                },
                )
            }
        </select>
    </>;
};

export default StationSelect;