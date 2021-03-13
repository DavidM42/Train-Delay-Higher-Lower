const isTESTMODE = false;
const BASE_URL = 'https://v5.db.transport.rest';

async function getDepartures(evaStation: number, duration: number  = 30, when?: Date) {
    // TODO more parameters?
    const url = new URL(`${BASE_URL}/stop/${evaStation}/departures`);
    
    if (duration) {
        url.searchParams.set('duration', duration.toString());
    }

    if (when && !isNaN(when.getTime())) {
        url.searchParams.set('when', when.toISOString());
    }

    // cap results to same value always
    url.searchParams.set('results', '200');
    
    return (await fetch(url.href)).json();
}

async function getArrivals(evaStation: number, duration: number = 30, when?: Date) {
    // TODO more parameters?
    const url = new URL(`${BASE_URL}/stops/${evaStation}/arrivals`);
    
    if (duration) {
        url.searchParams.set('duration', duration.toString());
    }
    if (when && !isNaN(when.getTime())) {
        url.searchParams.set('when', when.toISOString());
    }

    // cap results to same value always
    url.searchParams.set('results', '200');
    return (await fetch(url.href)).json();
}

async function getTotalArrivalDelay(evaStation: number, duration?: number, when?: Date) {
    // specify time and pick trips better
    try {
        const arrivals = await getArrivals(evaStation,duration,when);
        let totalDelay = 0;
        arrivals.forEach(element => {
            if (!element.delay) {
                totalDelay += 0;
            } else {
                totalDelay += element.delay;
            }
        });
        return Math.round(totalDelay * 100) / 100;
    } catch(e) {
        console.error(e);
        return null;
    }
}

async function getMeanArrivalDelay(evaStation: number, duration?: number, when?: Date) {
    // specify time and pick trips better
    try {
        const arrivals = await getArrivals(evaStation,duration,when);
        let totalDelay = 0;
        arrivals.forEach(element => {
            if (!element.delay) {
                totalDelay += 0;
            } else {
                totalDelay += element.delay;
            }
        });
        return Math.round((totalDelay / arrivals.length) * 100) / 100;
    } catch(e) {
        console.error(e);
        return null;
    }
}

async function getMeanDepartureDelay(evaStation: number, duration?: number, when?: Date) {
    // specify time and pick trips better
    try {
        const departure = await getDepartures(evaStation,duration,when);
        let totalDelay = 0;
        departure.forEach(element => {
            if (!element.delay) {
                totalDelay += 0;
            } else {
                totalDelay += element.delay;
            }
        });

        // random delays for testing if enabled and needed at night
        if (isTESTMODE) {
            return Math.random() * 100;
        }

        return Math.round((totalDelay / departure.length) * 100) / 100;
    } catch(e) {
        console.error(e);
        return null;
    }
}


export { getDepartures, getArrivals, getTotalArrivalDelay, getMeanArrivalDelay, getMeanDepartureDelay };