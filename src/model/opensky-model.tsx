//defining geographical bounds
export interface IMapGeoBounds {
  northernLatitude: number;
  southernLatitude: number;
  easternLongitude: number;
  westernLongitude: number;
}

//state vector parameters
export interface IStateVector {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  sensors: Array<number>;
  geo_altitude: number;
  squawk: string;
  spi: boolean;
  position_source: number;
  category: number;
}
export interface IStateVectorData {
  time: number;
  states: Array<IStateVector>;
}
export interface IStateVectorRawData {
  time: number;
  states: Array<Array<any>>;
}
