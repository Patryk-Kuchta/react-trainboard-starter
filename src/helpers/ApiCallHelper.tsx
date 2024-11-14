export type GetParams = ([string, string])[];

const validateEnvVars = () => {
    if (!process.env.REACT_APP_BASE_URL || !process.env.REACT_APP_X_API_KEY) {
        throw new Error('Required environment variables are not set');
    }
};

const validateParams = (params: GetParams) => {
    return params.every(([key, value]) => {
        return key.trim() !== '' && value.trim() !== '';
    });
};

export const fetchStations = () => {
    return fetch(`${process.env.REACT_APP_BASE_URL}/v1/stations`, {
        headers: {
            'X-API-KEY': `${process.env.REACT_APP_X_API_KEY}`,
        },
    });
};

export const makeGetRequestWithParams = (route: string, params: GetParams) => {
    validateEnvVars();
    validateParams(params);

    const paramsString = params.map(([key, value]) => {
        return encodeURI(key) + '=' + encodeURI(value);
    }).join('&');

    return fetch(`${process.env.REACT_APP_BASE_URL}/${route}?${paramsString}`, {
        headers: {
            'X-API-KEY': `${process.env.REACT_APP_X_API_KEY}`,
        },
    });
};
