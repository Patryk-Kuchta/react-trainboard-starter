import React, { FC, useContext } from 'react';
import StationInfoContext from '../contexts/StationInfoContext';

type StationSelectInput = {
    label: string;
    invalidSelections: string[];
    setSelection: (crs: string) => void;
}

const StationSelect : FC<StationSelectInput> = ({ label, invalidSelections, setSelection }) => {

    const stationInfoContext = useContext(StationInfoContext);

    const elementId = label.toLowerCase();

    if (stationInfoContext.stations.length === 0) {
        // reset during loading to prevent unexpected behaviour
        setSelection('');
    }

    return <>
        <label htmlFor = { elementId }>{label} station:</label>
        <select
            name = { elementId }
            id = { elementId }
            onChange = { (event) => {
                setSelection(event.target.value);
            } }
            disabled = { stationInfoContext.stations.length === 0 }
        >
            {
                stationInfoContext.stations.length > 0?
                    <>
                        <option value = "">Select...</option>
                        {
                            stationInfoContext.stations.map((station, key) => {
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
                    </>
                    :
                    <>
                        <option value = "">Loading Stations...</option>
                    </>
            }

        </select>
    </>;
};

export default StationSelect;