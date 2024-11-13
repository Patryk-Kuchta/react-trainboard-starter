import React, { FC, useEffect, useState } from 'react';

const FutureDateSelect : FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState((new Date()).toISOString);
    const [currentWarning, setCurrentWarning] = useState(Warning.NoWarning);

    useEffect(() => {
        const now = new Date();
        const formattedDateTime = now.toISOString();
        setCurrentDateTime(formattedDateTime);
        console.log(formattedDateTime);
    }, []);

    return (
        <div>
            <div id = { 'warning' } style = { { display: currentWarning !== Warning.NoWarning ? 'block' : 'none' } }>
                Please
                <span> select </span>
                a
                <span> valid date</span>
                <span> in the future. </span>
            </div>

            <input
                aria-label = "Date and time"
                type = "datetime-local"
                value = { currentDateTime }
                min = { currentDateTime }
                onChange = { (e) => setCurrentDateTime(e.target.value) }
            />
        </div>

    );
};

enum Warning {
    NoWarning,
    NoSelection,
    InvalidSelection,
    PastSelection
}

export default FutureDateSelect;