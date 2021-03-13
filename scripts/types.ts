export interface PhotoItem {
    eva?: number,
    name?: string,
    country: string,
    idStr: string,
    id: number,
    title: string,
    lat: number,
    lon: number,
    valid: true,
    photographer: string,
    photographerUrl: string,
    photoUrl: string,
    license: string,
    licenseUrl: string,
    createdAt: number,
    active: boolean,
    DS100: string
}

export interface StationResponse {
    type: string,
	id: number,
	additionalIds: string[],
	ril100: string,
	nr: number,
	name: string,
	weight: number
    // and much more too
    // see for example  https://v5.db.transport.rest/stations/RORW
    // or https://v5.db.transport.rest/stations/RORW
    // or https://www.npmjs.com/package/db-stations
}

// copied in types of source also 
export interface InternStationFormat {
    name: string,
    photoUrl: string,
    photographer: string
    license: string
}
