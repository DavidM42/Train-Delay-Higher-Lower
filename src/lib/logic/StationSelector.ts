import type { DelayInfo } from '../typing/types';

import { browser } from '$app/environment';
import type { StationMapping } from '$lib/typing/stations';
import { randomKey } from './helpers';
import { getTotalArrivalDelay } from './vendo-api';

const wantedCacheSize = 3; // can adjust based on performance and api limits, currently

/**
 * If invalid will return false if valid will return average mean arrival
 * @param eva Eva number of station to check
 */
async function delayDataIfValid(
	eva: number,
	usedCityCodes: number[],
	disqualifiedCityCodes: number[]
): Promise<number | false> {
	if (usedCityCodes.includes(eva) || disqualifiedCityCodes.includes(eva)) {
		return false;
	}

	// const testDate = new Date('2021-03-12');
	// testDate.setHours(23, 30, 30);
	//
	// was needed if api only works in backend

	let delay: number | null;
	// if in browser fetch via server route to avoid cors issues, if in server directly call api method
	if (browser) {
		delay = await fetch('/total-delay/' + eva).then((res) => res.json());
	} else {
		delay = await getTotalArrivalDelay(eva);
	}

	// would like to directly pull from here but cors not enabled in vendo api
	if (!delay || delay <= 0) {
		// does not work correctly so disqualify for now
		disqualifiedCityCodes.push(eva);
		return false;
	}
	// will use this city
	usedCityCodes.push(eva);
	return delay;
}

/**
 * Not exported raw method to get next station delay.
 * Used by outwards facing public method integrating cache of completed requests
 */
async function nextStationDelay(
	stationMap: StationMapping,
	usedCityCodes: number[],
	disqualifiedCityCodes: number[]
): Promise<DelayInfo | null> {
	// can't loop more often than we have stationns
	for (let i = 0; i < Object.keys(stationMap).length; i++) {
		// TODO debug
		// TODO limit to 5 for now but overthink after ensuring api does not get hammered
		// for (let i = 0; i < 5; i++) {
		// still randomize order for challenge and fun
		let randStationEva = Number(randomKey(stationMap));

		// add prepending zero
		if ((randStationEva + '').length === 6) {
			randStationEva = Number('0' + randStationEva);
		}

		const delay = await delayDataIfValid(randStationEva, usedCityCodes, disqualifiedCityCodes);

		if (delay) {
			return {
				eva: randStationEva,
				name: stationMap[randStationEva].name,
				photoName: stationMap[randStationEva].photoName,
				photographer: stationMap[randStationEva].photographer,
				license: stationMap[randStationEva].license,
				delay: delay
			};
		}
	}
	return null;
}

/******************* Externally available functions **************************************************/

/**
 * Replenish stationDelayInfoPromiseCache with new promises to get next station delay infos.
 * Only replenishes if there are less than 5 entries in cache to avoid overfilling and hammering api.
 */
export function replenishNextStationPromiseCache(
	stationMap: StationMapping,
	stationDelayInfoPromiseCache: Map<number, Promise<DelayInfo | null>>,
	usedCityCodesCache: number[],
	disqualifiedCityCodesCache: number[]
) {
	const containedLength = stationDelayInfoPromiseCache.keys().toArray().length;

	if (containedLength >= 5) {
		return;
	}

	const missing = wantedCacheSize - containedLength;
	for (let i = 0; i < missing; i++) {
		// random number between 1 and 1000 hopefully no collisions in this range
		const randomCacheId = Math.floor(Math.random() * 1000);
		stationDelayInfoPromiseCache.set(
			randomCacheId,
			nextStationDelay(stationMap, usedCityCodesCache, disqualifiedCityCodesCache)
		);
	}
	return;
}

/**
 * Outwards facing method. Outputs a next station to use and replenishes cache with new station delay info promises.
 */
export async function getNextStationArrivalDelay(
	stationMap: StationMapping,
	stationDelayInfoPromiseCache: Map<number, Promise<DelayInfo | null>>,
	usedCityCodes: number[],
	disqualifiedCityCodes: number[]
): Promise<DelayInfo | null> {
	// race promises, delete retrieved one from cache, replenish cache with new ones, return retrieved info
	const racePromise = Promise.race(stationDelayInfoPromiseCache);
	const resolvedRacePromise = await racePromise;
	const [cacheUuid, nextStationDelayInfo] = resolvedRacePromise;

	stationDelayInfoPromiseCache.delete(cacheUuid);
	replenishNextStationPromiseCache(
		stationMap,
		stationDelayInfoPromiseCache,
		usedCityCodes,
		disqualifiedCityCodes
	);
	return nextStationDelayInfo;
}
