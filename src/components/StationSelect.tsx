import React, { FC, useContext, useEffect } from 'react';
import { StationInfoContext } from '../contexts/StationInfoContext';

type StationSelectInput = {
    label: string;
    invalidSelections: string[];
    setSelection: (crs: string) => void;
}

const StationSelect : FC<StationSelectInput> = ({ label, invalidSelections, setSelection }) => {

    const stationInfoContext = useContext(StationInfoContext);

    const elementId = label.toLowerCase();

    useEffect(() => {
        if (stationInfoContext.stations.length === 0) {
            // Reset selection when stations are not available to prevent invalid state
            setSelection('');
        }
    }, [stationInfoContext.stations.length, setSelection]);

    return <div className = { 'station_select' }>
        <label htmlFor = { elementId }>{label} station:</label>
        <select
            name = { elementId }
            id = { elementId }
            onChange = { (event) => {
                setSelection(event.target.value);
            } }
            disabled = { stationInfoContext.stations.length === 0 }
            aria-label = { `Select ${label} station` }
            data-testid = { elementId }
            required = { true }
        >
            {
                stationInfoContext.stations.length > 0?
                    <>
                        <option value = "">Select...</option>
                        {
                            stationInfoContext.stations.map((station) => {
                                return (
                                    <option
                                        value = { station.crs }
                                        key = { station.crs }
                                        disabled = { invalidSelections.includes(station.crs) }
                                        aria-invalid = { invalidSelections.includes(station.crs) }
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
    </div>;
};

export default StationSelect;