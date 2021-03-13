import { STATIONS } from './data';
import { getTotalArrivalDelay } from './api';
import type { DelayInfo } from './typing/types';

export default class StationSelector {
    
    private usedCityCodes = [];
    private disqualifiedCityCodes = [];
    
    constructor() {

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

    public async getNextStationArrivalDelay(): Promise<DelayInfo | null> {
        // can't loop more often than we have stationns
        for (let i = 0; i < Object.keys(STATIONS).length; i++) {
            // still randomize order for challenge and fun
            let randStationEva = Number(randomKey(STATIONS));

            // add prepending zero
            if ((randStationEva + '').length === 6) {
                randStationEva = Number('0' + randStationEva)
            }

            const delay = await this.delayDataIfValid(randStationEva);

            if (delay) {
                return {
                    eva: randStationEva,
                    name: STATIONS[randStationEva].name,
                    image: STATIONS[randStationEva].image,
                    delay: delay
                };
            }
        }
    }
}



// https://stackoverflow.com/a/37401010
const randomKey = function (obj) {
    return Object.keys(obj)[Math.floor(Math.random()*Object.keys(obj).length)]
};