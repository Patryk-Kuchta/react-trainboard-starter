export const fetchStations = () => {
    return fetch(`${process.env.BASE_URL}/v1/stations`, {
        headers: {
            'X-API-KEY': `${process.env.REACT_APP_X_API_KEY}`,
        },
    });
};
