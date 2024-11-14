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
    isLoading: boolean;
}

export const StationInfoContext = createContext<StationInfoParameters>({
    stations: [],
    crsList: [],
    isLoading: true,
});

export const StationInfoContextProvider : FC<{children : ReactNode}> = ({ children }) => {
    return (
        <StationInfoContext.Provider value = {
            {
                stations: hardCodedStations,
                crsList: hardCodedStations.map((station) => station.crs),
                isLoading: false,
            }
        }>
            {children}
        </StationInfoContext.Provider>
    );
};

