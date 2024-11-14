import React, { FC, ReactNode } from 'react';
import { StationInfoContext } from '../../contexts/StationInfoContext';

const LONDON_COORDINATES = {
    latitude: 51.5074,
    longitude: -0.1278,
};

const MANCHESTER_COORDINATES = {
    latitude: 53.4808,
    longitude: -2.2426,
};

export const mockStations = [
    {
        id: 1,
        name: 'Station 1',
        aliases: ['Station 1 Alias'],
        crs: 'STA1',
        nlc: 'NL1',
        ...LONDON_COORDINATES,
        isGroupStation: false,
        isSilverSeekStation: true,
    },
    {
        id: 2,
        name: 'Station 2',
        aliases: ['Station 2 Alias'],
        crs: 'STA2',
        nlc: 'NL2',
        ...MANCHESTER_COORDINATES,
        isGroupStation: true,
        isSilverSeekStation: false,
    },
    {
        id: 3,
        name: 'Station 3',
        aliases: [], // Empty aliases for edge case testing
        crs: 'STA3',
        nlc: 'NL3',
        latitude: 52.4862,
        longitude: -1.8904,
        isGroupStation: false,
        isSilverSeekStation: false,
    },
];

const mockCrsList = mockStations.map((station) => station.crs);

interface MockStationInfoContextProviderProps {
    children: ReactNode;
    keepEmpty?: boolean;
}
const MockStationInfoContextProvider: FC<MockStationInfoContextProviderProps> = ({
    children,
    keepEmpty = false,
}) => {
    return (
        <StationInfoContext.Provider
            value = { {
                stations: keepEmpty ? [] : mockStations,
                crsList: keepEmpty ? [] : mockCrsList,
                isLoading: false,
            } }
        >
            {children}
        </StationInfoContext.Provider>
    );
};

export default MockStationInfoContextProvider;
