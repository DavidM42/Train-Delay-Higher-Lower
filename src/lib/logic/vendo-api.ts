import { createClient } from 'db-vendo-client';
import { profile as dbNavProfile } from 'db-vendo-client/p/db/index.js';

// const isTESTMODE = false;

// TODO domain
const userAgent = 'train-delay-higher-lower';
const client = createClient(dbNavProfile, userAgent, { enrichStations: false });

async function getDepartures(evaStation: number, duration: number = 30, when?: Date) {
	const opts = {} as any;

	if (duration) {
		opts.duration = duration;
	}

	if (when && !isNaN(when.getTime())) {
		opts.when = when;
	}

	// cap results to same value always
	opts.results = 200;

	return (await client.departures(evaStation + '', opts)).departures;
}

async function getArrivals(evaStation: number, duration: number = 30, when?: Date) {
	const opts = {} as any;

	if (duration) {
		opts.duration = duration;
	}

	if (when && !isNaN(when.getTime())) {
		opts.when = when;
	}

	// cap results to same value always
	opts.results = 200;
	return (await client.arrivals(evaStation + '', opts)).arrivals;
}

async function getTotalArrivalDelay(evaStation: number, duration?: number, when?: Date) {
	// specify time and pick trips better
	try {
		const arrivals = await getArrivals(evaStation, duration, when);

		let totalDelay = 0;
		arrivals.forEach((element) => {
			const delay = element.delay ? element.delay / 60 : null;
			if (!delay) {
				totalDelay += 0;
			} else {
				totalDelay += delay;
			}
		});
		return Math.round(totalDelay * 100) / 100;
	} catch (e) {
		console.error(e);
		return null;
	}
}

// async function getMeanArrivalDelay(evaStation: number, duration?: number, when?: Date) {
// 	// specify time and pick trips better
// 	try {
// 		const arrivals = await getArrivals(evaStation, duration, when);
// 		let totalDelay = 0;
// 		arrivals.forEach((element) => {
// 			const delay = element.delay ? element.delay / 60 : null;
// 			if (!delay) {
// 				totalDelay += 0;
// 			} else {
// 				totalDelay += delay;
// 			}
// 		});
// 		return Math.round((totalDelay / arrivals.length) * 100) / 100;
// 	} catch (e) {
// 		console.error(e);
// 		return null;
// 	}
// }

// async function getMeanDepartureDelay(evaStation: number, duration?: number, when?: Date) {
// 	// specify time and pick trips better
// 	try {
// 		const departure = await getDepartures(evaStation, duration, when);
// 		let totalDelay = 0;
// 		departure.forEach((element) => {
// 			const delay = element.delay ? element.delay / 60 : null;
// 			if (!delay) {
// 				totalDelay += 0;
// 			} else {
// 				totalDelay += delay;
// 			}
// 		});

// 		// random delays for testing if enabled and needed at night
// 		if (isTESTMODE) {
// 			return Math.random() * 100;
// 		}

// 		return Math.round((totalDelay / departure.length) * 100) / 100;
// 	} catch (e) {
// 		console.error(e);
// 		return null;
// 	}
// }

// export { getArrivals, getDepartures, getMeanArrivalDelay, getMeanDepartureDelay, getTotalArrivalDelay };
export { getTotalArrivalDelay };
