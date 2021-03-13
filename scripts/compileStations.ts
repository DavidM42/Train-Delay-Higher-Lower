const fs = require('fs');

import { getPhotoItems, getStation, getEva } from './apiInteraction';
import { PhotoItem, InternStationFormat } from './types';

// empirical found value -> fulda is 343
// want stations around that important not less so 300
const MIN_REQUIRED_STATION_WEIGHT = 300;

const wait = async (timeMS: number) => {
    return new Promise(resolve => setTimeout(resolve, timeMS))
}

const createStationsJson = async () => {
    const photos = await getPhotoItems();

    const relevantPhotos: PhotoItem[] = [];

    // test settings
    // const allLength = 50;

    const allLength = photos.length;
    for (let i = 0; i < allLength; i++) {
        const element = photos[i];
        
        try {
            const station = await getStation(element.DS100);
            const stationWeight = station.weight;

            console.log('Current station: ' + station.name);

            const hasRevelantFeatures = station.id && station.name;
            if (hasRevelantFeatures && stationWeight >= MIN_REQUIRED_STATION_WEIGHT) {
                // relevant station to use in app
                const enhancedItem: PhotoItem = element;
                enhancedItem.eva = station.id;
                enhancedItem.name = station.name;
                relevantPhotos.push(enhancedItem);
            }
        } catch(e) {
            console.warn('Failed station request to get ' + element.DS100);
            console.error(e);
        }

        // rate limit poor api
        // max 100req/min for stations api
        await wait(1538);
    }


    const seenNames = [];
    const saveStations = {};
    for (let i = 0; i < relevantPhotos.length; i++) {
        const element = relevantPhotos[i];
        
        if (seenNames.includes(element.name)) {
            console.log('Duplicate stations name ' + element.name);
        } else {
            // create internal format station
            const intern: InternStationFormat = {
                name: element.name,
                photoUrl: element.photoUrl,
                photographer: element.photographer,
                license: element.license,
            };
            saveStations[element.eva]= intern;
        }
        seenNames.push(element.name);
    }

    console.log(JSON.stringify(saveStations));
    fs.writeFileSync('public/stations.json', JSON.stringify(saveStations));

    // testing find out weight examples
    // const neuhof = (await getFirstStationForSearch('Neuhof (Kr Fulda)')).weight;
    // const fulda = (await getFirstStationForSearch('Fulda')).weight;
    // const wue = (await getFirstStationForSearch('Wuerzburg')).weight;

};
createStationsJson();
