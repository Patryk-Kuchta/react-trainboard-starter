import React, { FC, ReactNode } from 'react';
import StationInfoContext from '../../contexts/StationInfoContext';

export const mockStations = [
    {
        id: 1,
        name: 'Station 1',
        aliases: ['Station 1 Alias'],
        crs: 'STA1',
        nlc: 'NL1',
        latitude: 51.5074,
        longitude: -0.1278,
        isGroupStation: false,
        isSilverSeekStation: true,
    },
    {
        id: 2,
        name: 'Station 2',
        aliases: ['Station 2 Alias'],
        crs: 'STA2',
        nlc: 'NL2',
        latitude: 51.5074,
        longitude: -0.1278,
        isGroupStation: true,
        isSilverSeekStation: false,
    },
];

const mockCrsList = mockStations.map((station) => station.crs);

const MockStationInfoContextProvider: FC<{children: ReactNode; keepEmpty: boolean}> = ({ children, keepEmpty }) => {
    return (
        <StationInfoContext.Provider value = { { stations: keepEmpty? [] : mockStations, crsList: keepEmpty? [] : mockCrsList } }>
            {children}
        </StationInfoContext.Provider>
    );
};

export default MockStationInfoContextProvider;
