import React from 'react';
import { createContext, FC, ReactNode } from 'react';
import hardCodedStations from '../data/hardCodedStations.json';

type StationEntry = {
    id: number;
    name: string;
    aliases: string[];
    crs: string;
    nlc: string;
    latitude: number | null;
    longitude: number | null;
    isGroupStation: boolean;
    isSilverSeekStation: boolean;
}

type StationInfoParameters = {
    stations: StationEntry[];
    crsList: string[];
}

const StationInfoContext = createContext<StationInfoParameters>({
    stations: [],
    crsList: [],
});

export const StationInfoContextProvider : FC<{children : ReactNode}> = ({ children }) => {
    return (
        <StationInfoContext.Provider value = {
            {
                stations: hardCodedStations,
                crsList: hardCodedStations.map((station) => station.crs),
            }
        }>
            {children}
        </StationInfoContext.Provider>
    );
};

export default StationInfoContext;
