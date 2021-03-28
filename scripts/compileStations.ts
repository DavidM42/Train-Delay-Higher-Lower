const fs = require('fs');

import { getPhotoItems, getStation, getEva } from './apiInteraction';
import { downloadFile } from './imageSaving';
import { PhotoItem, InternalStationFormat } from './types';

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
    // const allLength = 150;

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
            const urlSplit = element.photoUrl.split('/');
            const fileName = urlSplit[urlSplit.length -1];

            // also download and cache image for faster use in app
            // and in web cdn load faster than bahn api
            downloadFile(element.photoUrl, `public/station-images/${fileName}`);
            console.log(`Downloaded ${fileName} from ${element.photoUrl}`);

            // create internal format station
            const intern: InternalStationFormat = {
                name: element.name,
                photoName: fileName,
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
