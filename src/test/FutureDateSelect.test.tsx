import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import moment from 'moment';
import FutureDateSelect from '../components/FutureDateSelect';

const mockedSetSelectedDate = jest.fn();

jest.useFakeTimers();

const test_id = 'datetime_picker';

it('should render with the current date and time by default', () => {
    const { getByTestId } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    expect(dateInput.value).toBe(formattedDate);
});

it('should not allow selecting a past date/time beyond the 15-minute grace period', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const pastDate = new Date();
    pastDate.setMinutes(pastDate.getMinutes() - 20);
    dateInput.value = pastDate.toISOString().slice(0, 16);
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    expect(getByText('in the future.')).toBeInTheDocument();
});

it('should trigger a warning when no date or an invalid date is selected', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    dateInput.value = '';
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    expect(getByText('valid date')).toBeInTheDocument();
});

it('should trigger a warning if the selected time becomes outdated after some time', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 5);
    dateInput.value = futureDate.toISOString().slice(0, 16);
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    jest.advanceTimersByTime(900000);
    expect(getByText('in the future.')).toBeInTheDocument();
});

it('should initially pass the current date to the parent component via setSelectedDate', () => {
    const { getByTestId } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const currentDate = moment();
    const formattedDate = currentDate.toISOString().slice(0, 16);

    expect(dateInput.value).toBe(formattedDate);
    expect(mockedSetSelectedDate).toHaveBeenCalledWith(currentDate);
});

it('should pass the selected date to the parent component via setSelectedDate', () => {
    const { getByTestId } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const newDate = moment();
    newDate.add(10, 'minutes');
    fireEvent.change(dateInput, { target: { value: newDate.toISOString().slice(0, 16) } });
    expect(mockedSetSelectedDate.mock.calls[2][0]).toHaveBeenCalledWith(newDate);
});

it('should show a warning when a date more than 15 minutes in the past is selected', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const invalidDate = new Date();
    invalidDate.setMinutes(invalidDate.getMinutes() - 16);
    dateInput.value = invalidDate.toISOString().slice(0, 16);
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    expect(getByText('in the future.')).toBeInTheDocument();
});
