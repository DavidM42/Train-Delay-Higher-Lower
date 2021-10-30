import { getTotalArrivalDelay } from './api';
import type { DelayInfo } from '../typing/types';
import type { StationMapping } from '../typing/stations';

export default class StationSelector {

    private usedCityCodes = [];
    private disqualifiedCityCodes = [];

    private stations: StationMapping = {};

    /**
     * Contains Map of promises to get DelayInfo (effectively innerNextStationDelay method return).
     * Mapped via randomId to later remove from cache after retrieving result.
     */
    private stationDelayInfoPromiseCache = new Map<number, Promise<DelayInfo | null>>();

    constructor(stations: StationMapping) {
        this.stations = stations;
        this.replenishNextStationPromiseCache();
    }

    /**
     * If invalid will return false if valid will return average mean arrival
     * @param eva Eva number of station to check
     */
    public async delayDataIfValid(eva: number): Promise<number | false> {
        if (this.usedCityCodes.includes(eva) || this.disqualifiedCityCodes.includes(eva)) {
            return false;
        }

        // const testDate = new Date('2021-03-12');
        // testDate.setHours(23, 30, 30);
        const delay = await getTotalArrivalDelay(eva);
        if (!delay || delay <= 0) {
            // does not work correctly so disqualify for now
            this.disqualifiedCityCodes.push(eva);
            return false;
        }
        // will use this city
        this.usedCityCodes.push(eva);
        return delay;
    }

    /**
     * Inner raw method to get next station delay.
     * Used by outwards facing public method integrating cache of completed requests
     */
    private async innerNextStationDelay(): Promise<DelayInfo | null> {
        // can't loop more often than we have stationns
        for (let i = 0; i < Object.keys(this.stations).length; i++) {
            // still randomize order for challenge and fun
            let randStationEva = Number(randomKey(this.stations));

            // add prepending zero
            if ((randStationEva + '').length === 6) {
                randStationEva = Number('0' + randStationEva)
            }

            const delay = await this.delayDataIfValid(randStationEva);

            if (delay) {
                return {
                    eva: randStationEva,
                    name: this.stations[randStationEva].name,
                    photoName: this.stations[randStationEva].photoName,
                    photographer: this.stations[randStationEva].photographer,
                    license: this.stations[randStationEva].license,
                    delay: delay
                };
            }
        }
    }

    private replenishNextStationPromiseCache() {
        const containedLength = Object.keys(this.stationDelayInfoPromiseCache).length;

        if (containedLength > 5) {
            return;
        }

        const missing = 5 - containedLength;
        for (let i = 0; i < missing; i++) {
            // random number between 1 and 1000 hopefully no collisions in this range
            const randomCacheId = Math.floor(Math.random() * 1000);
            this.stationDelayInfoPromiseCache.set(randomCacheId, this.innerNextStationDelay());
        }
    }

    /**
     * Outwards facing method to get new stations with pre loaded delay infos
     */
    public async getNextStationArrivalDelay(): Promise<DelayInfo | null> {
        // race promises, delete retrieved one from cache, replenish cache with new ones, return retrieved info
        const racePromise = Promise.race(this.stationDelayInfoPromiseCache);
        const resolvedRacePromise = await racePromise;
        const [cacheUuid, nextStationDelayInfo] = resolvedRacePromise;

        this.stationDelayInfoPromiseCache.delete(cacheUuid);
        this.replenishNextStationPromiseCache();
        return nextStationDelayInfo;
    }
}



// https://stackoverflow.com/a/37401010
const randomKey = function (obj) {
    return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]
};