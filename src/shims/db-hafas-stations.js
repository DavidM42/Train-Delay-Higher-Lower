// provide a no-op async iterator so db-vendo-client.readFullStations() works in the browser build
export async function* readFullStations() {}
export default { readFullStations };

// whole db-hafas-stations library is not browser-compatible, but we need to provide a stub for the readFullStations function
// the library is dynamically imported by vendo-api (and ignored when enrichStations is off)
// but vite build wants to resolve even dynamic imports at build and fails in rollup
