// copied in scripts types too
interface InternStationFormat {
    name: string,
    photoUrl: string,
    photographer: string
    license: string
};

export interface StationMapping { 
    [eva: number]: InternStationFormat 
}