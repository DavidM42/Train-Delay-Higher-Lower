import type { StationMapping } from '$lib/typing/stations';

// https://stackoverflow.com/a/37401010
export const randomKey = function (obj: StationMapping) {
	return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];
};
