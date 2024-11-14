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

    describe('with a search button tooltip', () => {
        const searchButton = screen.getByText(/Search.../i);

        // Initially tooltip should not be visible
        expect(screen.queryByText(/Please select both valid origin and destination stations./i))
            .not.toBeInTheDocument();

        // Show tooltip on hover
        fireEvent.mouseOver(searchButton);
        expect(screen.getByText(/Please select both valid origin and destination stations./i))
            .toBeInTheDocument();
    });

    // select the origin station first
    const originSelection = 'STA1';
    let selectElement = screen.getByTestId('origin');
    fireEvent.change(selectElement, { target: { value: originSelection } });

    describe('with the search button blocked when only origin is selected', () => {
        const searchButton = screen.getByText(/Search.../i);
        expect(searchButton).toBeInTheDocument();
        expect(searchButton).toBeDisabled();
    });

    // select the destination station
    const destinationSelection = 'STA2';
    selectElement = screen.getByTestId('destination');
    fireEvent.change(selectElement, { target: { value: destinationSelection } });

    describe('with the destination blocked on the origin side', () => {
        const selectElement = screen.getByTestId('origin');
        for (const stationIndex in mockStations) {
            const station = mockStations[stationIndex];
            const stationOption = selectElement.querySelector(`[value="${station.crs}"]`);
            expect(stationOption).toBeInTheDocument();
            if (station.crs !== destinationSelection) {
                expect(stationOption).toBeEnabled();
            } else {
                expect(stationOption).toBeDisabled();
            }
        }
    });

    describe('with the origin blocked on the destination side', () => {
        const selectElement = screen.getByTestId('destination');
        for (const stationIndex in mockStations) {
            const station = mockStations[stationIndex];
            const stationOption = selectElement.querySelector(`[value="${station.crs}"]`);
            expect(stationOption).toBeInTheDocument();
            if (station.crs !== originSelection) {
                expect(stationOption).toBeEnabled();
            } else {
                expect(stationOption).toBeDisabled();
            }
        }
    });

    describe('with the search button unblocked after selection', () => {
        const searchButton = screen.getByText(/Search.../i);
        expect(searchButton).toBeInTheDocument();
        expect(searchButton).toBeEnabled();
    });
});

