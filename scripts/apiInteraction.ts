const photoApiKey = process.env.STATION_PHOTO_API_KEY;

if (!photoApiKey) {
    throw Error('Missing photoApi key. Please ensure the env var STATION_PHOTO_API_KEY is set');
}

import fetch from 'node-fetch';
import { PhotoItem, StationResponse } from './types';

const getPhotoItems = async (): Promise<PhotoItem[]> => {
    const getDeStationsUrl = 'https://api.deutschebahn.com/bahnhofsfotos/v1/de/stations?hasPhoto=true';
    const headers = {
        'Authorization': `Bearer ${photoApiKey}`
    };

    try {
        const stationsResponse = await fetch(getDeStationsUrl, {
            headers: headers
        });

        const stationsJson: PhotoItem[] = await stationsResponse.json();

        if ((stationsJson as any).error) {
            console.warn(stationsJson);
            throw Error('Getting stations from db failed!');
        }
        return stationsJson;
    } catch(e) {
        console.error('Getting stations from db failed!');
        throw e;
    }
};


const getFirstStationForSearch = async (searchTerm: string): Promise<StationResponse> => {
    const searchEvaUrl = new URL('https://v5.db.transport.rest/stations');
    searchEvaUrl.searchParams.set('query', searchTerm);

    const stationResponse = await fetch(searchEvaUrl.href);
    const stationJson = await stationResponse.json();
    const firstStation: StationResponse = stationJson[Object.keys(stationJson)[0]];
    return firstStation;
};

const getStation = async (DS100: string): Promise<StationResponse> => {
    const getEvaUrl = `https://v5.db.transport.rest/stations/${DS100}`;

    const stationResponse = await fetch(getEvaUrl);
    const stationJson: StationResponse = await stationResponse.json();
    return stationJson;
};

const getEva = async (DS100?: string, searchTerm?: string): Promise<number> => {
    if (DS100) {
        return (await getStation(DS100)).id;
    }
    if (searchTerm) {
        return (await getFirstStationForSearch(searchTerm)).id;
    }
}

export { getPhotoItems, getFirstStationForSearch, getStation, getEva };