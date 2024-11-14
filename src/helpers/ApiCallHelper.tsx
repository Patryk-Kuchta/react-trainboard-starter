export const fetchStations = () => {
    return fetch(`${process.env.REACT_APP_BASE_URL}/v1/stations`, {
        headers: {
            'X-API-KEY': `${process.env.REACT_APP_X_API_KEY}`,
        },
    });
};

export type getParams = ([string, string])[];

export const makeGetRequestWithParams = (route: string, params: getParams) => {
    const paramsString = params.map(([key, value]) => {
        return encodeURI(key) + '=' + encodeURI(value);
    }).join('&');

    console.log(`${process.env.REACT_APP_BASE_URL}/${route}?${paramsString}`);

    return fetch(`${process.env.REACT_APP_BASE_URL}/${route}?${paramsString}`, {
        headers: {
            'X-API-KEY': `${process.env.REACT_APP_X_API_KEY}`,
        },
    });
};
