import React, { FC, useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment';

enum Warning {
    NoWarning,
    NoSelection,
    InvalidSelection,
    PastSelection
}

type FutureDateSelectPrompts = {
    setSelectedDate: (date: Moment | null) => void;
}

const FutureDateSelect: FC<FutureDateSelectPrompts> = ({ setSelectedDate }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentWarning, setCurrentWarning] = useState(Warning.NoWarning);

    useEffect(() => {
        const formattedDateTime = moment().format('YYYY-MM-DDTHH:mm');
        
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

    return (
        <div>
            <div
                id = "warning"
                style = { { display: currentWarning !== Warning.NoWarning ? 'block' : 'none' } }
            >
                {'Please '}
                <span style = { { fontWeight: currentWarning === Warning.NoSelection ? 'bold': 'normal' } }>
                   select
                </span>
                {' a '}
                <span style = { { fontWeight: currentWarning === Warning.InvalidSelection ? 'bold': 'normal' } }>
                    valid date
                </span>
                <span style = { { fontWeight: currentWarning === Warning.PastSelection ? 'bold': 'normal' } }>
                    {' in the future. '}
                </span>
            </div>

            <input
                ref = { inputRef }
                aria-label = "Date and time"
                type = "datetime-local"
                onChange = { handleChange }
            />
        </div>
    );
};

export default FutureDateSelect;
