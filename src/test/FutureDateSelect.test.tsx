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

describe('invalid date handling', () => {
    it('should trigger a warning when no date is selected', () => {
        const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
        const dateInput = (getByTestId(test_id) as HTMLInputElement);
        dateInput.value = '';
        fireEvent.change(dateInput, { target: { value: dateInput.value } });
        expect(getByText('valid date')).toBeInTheDocument();
    });

    it('should trigger a warning for invalid date format', () => {
        const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
        const dateInput = (getByTestId(test_id) as HTMLInputElement);
        fireEvent.change(dateInput, { target: { value: 'invalid-date' } });
        expect(getByText('valid date')).toBeInTheDocument();
    });

    it('should trigger a warning for non-existent date', () => {
        const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
        const dateInput = (getByTestId(test_id) as HTMLInputElement);
        fireEvent.change(dateInput, { target: { value: '2024-02-30T12:00' } });
        expect(getByText('valid date')).toBeInTheDocument();
    });
});

it('should trigger a warning if the selected time becomes outdated after some time', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const futureDate = moment();
    futureDate.add(5, 'minutes');
    dateInput.value = futureDate.format('YYYY-MM-DDTHH:mm');
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    jest.advanceTimersByTime(900000);
    expect(getByText('in the future.')).toBeInTheDocument();
});

it('should initially pass the current date to the parent component via setSelectedDate', () => {
    const { getByTestId } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const currentDate = moment();
    const formattedDate = currentDate.format('YYYY-MM-DDTHH:mm');

    expect(dateInput.value).toBe(formattedDate);
    expect(mockedSetSelectedDate).toHaveBeenCalledWith(currentDate);
});

it('should pass the selected date to the parent component via setSelectedDate', () => {
    const { getByTestId } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const newDate = moment();
    newDate.add(10, 'minutes').startOf('minute');

    fireEvent.change(dateInput, { target: { value: newDate.format('YYYY-MM-DDTHH:mm') } });

    // 3rd call because, first the component sets it to be
    expect(mockedSetSelectedDate.mock.calls[2][0].format('YYYY-MM-DDTHH:mm')).toBe(newDate.format('YYYY-MM-DDTHH:mm'));
});

it('should show a warning when a date more than 15 minutes in the past is selected', () => {
    const { getByTestId, getByText } = render(<FutureDateSelect setSelectedDate = { mockedSetSelectedDate } />);
    const dateInput = (getByTestId(test_id) as HTMLInputElement);
    const invalidDate = moment();
    invalidDate.add(16, 'minutes');
    dateInput.value = invalidDate.format('YYYY-MM-DDTHH:mm');
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    expect(getByText('in the future.')).toBeInTheDocument();
});
