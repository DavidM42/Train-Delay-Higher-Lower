import { replenishNextStationPromiseCache } from '$lib/logic/StationSelector';
import stations from '$lib/stations.json';
import type { StationMapping } from '$lib/typing/stations';
import type { DelayInfo } from '$lib/typing/types';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const stationMap: StationMapping = stations as unknown as StationMapping;
	const usedCityCodes: number[] = [];
	const disqualifiedCityCodes: number[] = [];

	/**
	 * Contains Map of promises to get DelayInfo (effectively innerNextStationDelay method return).
	 * Mapped via randomId to later remove from cache after retrieving result.
	 */
	const stationDelayInfoPromiseCache = new Map<number, Promise<DelayInfo | null>>();

	/**
	 * Initial filling of promise on server side before loading page to have some preloaded data for first rounds and avoid waiting time for user.
	 */
	replenishNextStationPromiseCache(
		stationMap,
		stationDelayInfoPromiseCache,
		usedCityCodes,
		disqualifiedCityCodes
	);

	return {
		stationMap: stationMap,
		usedCityCodes: usedCityCodes,
		disqualifiedCityCodes: disqualifiedCityCodes,
		stationDelayInfoPromiseCache: stationDelayInfoPromiseCache
	};
}
