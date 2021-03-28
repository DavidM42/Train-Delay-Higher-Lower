// copied in scripts types too
interface InternStationFormat {
    name: string,
    photoName: string,
    photographer: string
    license: string
};

export interface StationMapping { 
    [eva: number]: InternStationFormat 
}