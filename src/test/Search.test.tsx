import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchPage from '../pages/SearchPage';
import MockStationInfoContextProvider, { mockStations } from './helpers/StationInfoContextMock';

// for the tooltip tests
global.ResizeObserver = class ResizeObserver {
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
};

render(<MockStationInfoContextProvider keepEmpty = { false }>
    <SearchPage/>
</MockStationInfoContextProvider>);

test('renders the correct welcome message', () => {
    const welcomeMessage = screen.getByText(/Find your next journey.../i);
    expect(welcomeMessage).toBeInTheDocument();
});

describe('renders two station selects', () => {
    const originSelect = screen.getByText(/Origin station:/i);
    expect(originSelect).toBeInTheDocument();

    const destinationSelect = screen.getByText(/Destination station:/i);
    expect(destinationSelect).toBeInTheDocument();

    const selectIds = ['origin', 'destination'];

    describe('with the correct stations and initially available', () => {
        for (const id of selectIds) {
            const selectElement = screen.getByTestId(id);
            for (const station of mockStations) {
                const stationOption = selectElement.querySelector(`[value="${station.crs}"]`);
                expect(stationOption).toBeInTheDocument();
                expect(stationOption).toBeEnabled();
            }
        }
    });

    describe('with the search button initially blocked', () => {
        const searchButton = screen.getByText(/Search.../i);
        expect(searchButton).toBeInTheDocument();
        expect(searchButton).toBeDisabled();
    });

    describe('with a tooltip attached (on hover only)', () => {
        const searchButton = screen.getByText(/Search.../i);
        let tooltip = screen.queryByText(/Please select both valid origin and destination stations./i);
        expect(tooltip).not.toBeInTheDocument();
        fireEvent.mouseOver(searchButton);
        tooltip = screen.getByText(/Please select both valid origin and destination stations./i);
        expect(tooltip).toBeInTheDocument();
        fireEvent.mouseLeave(searchButton);
    });

    // select an option in each of the select boxes
    for (const index in selectIds) {
        const id = selectIds[index];
        const selection = mockStations[index].crs;
        const selectElement = screen.getByTestId(id);
        fireEvent.change(selectElement, { target: { value: selection } });
    }

    describe('with blocking of options that make the journey to the same place', () => {

        for (const index in selectIds) {
            const id = selectIds[index];
            const selectElement = screen.getByTestId(id);
            for (const stationIndex in mockStations) {
                const station = mockStations[stationIndex];
                const stationOption = selectElement.querySelector(`[value="${station.crs}"]`);
                expect(stationOption).toBeInTheDocument();
                if (index === stationIndex) {
                    expect(stationOption).toBeEnabled();
                } else {
                    expect(stationOption).toBeDisabled();
                }
            }
        }
    });

    describe('with the search button unblocked after selection', () => {
        const searchButton = screen.getByText(/Search.../i);
        expect(searchButton).toBeInTheDocument();
        expect(searchButton).toBeEnabled();
    });
});

