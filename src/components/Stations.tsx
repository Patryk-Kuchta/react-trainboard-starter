import React, { useEffect, useState } from 'react';
import { fetchStations } from '../helpers/ApiCallHelper';

const Stations: React.FC = () => {

    const [allStations, setAllStations] = useState([]);

    useEffect(() => {
        fetchStations()
            .then((value) => console.log(value))
            .catch((err) => console.log(err))
            .finally(() => console.log('finally'));
    }, []);

    console.log('hello world');

    return (
        <div>
            Stations!
        </div>
    );
};

export default Stations;
