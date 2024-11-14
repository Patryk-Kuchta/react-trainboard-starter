import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StationSelect from '../components/StationSelect';
import MockStationInfoContextProvider, { mockStations } from './helpers/StationInfoContextMock';

test('renders the correct label', () => {
    render(<StationSelect invalidSelections = { [] } label = { 'Test' } setSelection = { jest.fn() }/>);
    const labelElement = screen.getByText(/Test station:/i);
    expect(labelElement).toBeInTheDocument();
});

test('renders the loading message', () => {
    render(
        <MockStationInfoContextProvider keepEmpty = { true }>
            <StationSelect invalidSelections = { [] } label = { 'Test' } setSelection = { jest.fn() }/>
        </MockStationInfoContextProvider>,
    );
    const inputElement = screen.getByText(/Loading Stations.../i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toBeDisabled();
});

test('renders all the stations', () => {
    render(
        <MockStationInfoContextProvider keepEmpty = { false }>
            <StationSelect invalidSelections = { [] } label = { 'Test' } setSelection = { jest.fn() }/>
        </MockStationInfoContextProvider>,
    );

    for (const station of mockStations) {
        const inputElement = screen.getByText(station.name);
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toBeEnabled();
    }
});

test('disables the stations on demand', () => {
    const disableDemands = [mockStations[0].crs];

    render(
        <MockStationInfoContextProvider keepEmpty = { false }>
            <StationSelect invalidSelections = { disableDemands } label = { 'Test' } setSelection = { jest.fn() }/>
        </MockStationInfoContextProvider>,
    );

    for (const station of mockStations) {
        const inputElement = screen.getByText(station.name);
        expect(inputElement).toBeInTheDocument();
        if (disableDemands.includes(station.crs)) {
            expect(inputElement).toBeDisabled();
        } else {
            expect(inputElement).toBeEnabled();
        }
    }
});

test('calls the correct station on selection', async () => {
    const mockSetSelection = jest.fn();

    render(
        <MockStationInfoContextProvider keepEmpty = { false }>
            <StationSelect invalidSelections = { [] } label = { 'Test' } setSelection = { mockSetSelection }/>
        </MockStationInfoContextProvider>,
    );

    const stationToSelect = screen.getByText(mockStations[0].name);

    if (stationToSelect.parentElement) {
        fireEvent.change(stationToSelect.parentElement, { target: { value: mockStations[0].crs } });

        await waitFor(() => {
            expect(mockSetSelection).toHaveBeenCalledWith(mockStations[0].crs);
        });
    }
});
