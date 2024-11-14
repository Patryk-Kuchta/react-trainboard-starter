import React, { FC, useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment';

enum Warning {
    NoWarning,
    NoSelection = 'no date is selected.',
    InvalidSelection = 'the selected date is not a valid date.',
    PastSelection = 'the date selected is in the past'
}

type FutureDateSelectPrompts = {
    setSelectedDate: (date: Moment | null) => void;
}

const FutureDateSelect: FC<FutureDateSelectPrompts> = ({ setSelectedDate }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentWarning, setCurrentWarning] = useState(Warning.NoWarning);

    useEffect(() => {
        const now = moment();
        const formattedDateTime = now.format('YYYY-MM-DDTHH:mm');

        setSelectedDate(now);
        
        if (inputRef.current) {
            inputRef.current.value = formattedDateTime;
            inputRef.current.min = formattedDateTime;
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setSelectedDate(null);

        if (selectedDate === '') {
            setCurrentWarning(Warning.NoSelection);
        } else {
            const dateTimeObject = moment(e.target.value, 'YYYY-MM-DDTHH:mm');
            if (dateTimeObject.isValid()) {
                const minimalDateTime = moment().add(-15, 'minutes');

                if (dateTimeObject >= minimalDateTime) {
                    setSelectedDate(dateTimeObject);
                    setCurrentWarning(Warning.NoWarning);
                } else {
                    setCurrentWarning(Warning.PastSelection);
                }
            } else {
                setCurrentWarning(Warning.InvalidSelection);
            }

        }

    };

    const warnUser = currentWarning !== Warning.NoWarning;

    return (
        <div>
            <div id = { 'datetime_picker_container' }>
                <label htmlFor = { 'datetime_picker' }>Departure date and time: </label>
                <input
                    id = { 'datetime_picker' }
                    data-testid = { 'datetime_picker' }
                    ref = { inputRef }
                    aria-label = { warnUser ? `The date is invalid because ${currentWarning}` : 'Valid date selected' }
                    type = "datetime-local"
                    onChange = { handleChange }
                />
            </div>

            <div
                id = "warning"
                style = { { display: warnUser ? 'block' : 'none' } }
            >
                Please
                <span className = { currentWarning === Warning.NoSelection ? 'date_warning_span highlight': 'date_warning_span' }>
                   select
                </span>
                a
                <span className = { currentWarning === Warning.InvalidSelection ? 'date_warning_span highlight': 'date_warning_span' }>
                    valid date
                </span>
                <span className = { currentWarning === Warning.PastSelection ? 'date_warning_span highlight': 'date_warning_span' }>
                    in the future.
                </span>
            </div>
        </div>
    );
};

export default FutureDateSelect;
