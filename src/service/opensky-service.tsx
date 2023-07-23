import {
  IMapGeoBounds,
  IStateVector,
  IStateVectorData,
  IStateVectorRawData,
} from "./../model/opensky-model";

const baseURL = "https://opensky-network.org/api";
const username = ""; //please use your own for auth
const password = ""; //please use your own for auth

// RATE LIMITER
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//retrieve state vectors
export const getStateVectors = async (mapGeoBounds: IMapGeoBounds) => {
  const stateBounds = `?lamin=${mapGeoBounds.southernLatitude}&lomin=${mapGeoBounds.westernLongitude}&lamax=${mapGeoBounds.northernLatitude}&lomax=${mapGeoBounds.easternLongitude}`;

  const targetUrl = `${baseURL}/states/all${stateBounds}`;

  // RETRY CONFIG
  const maxRetries = 5;
  const retryInterval = 3000; // 3 seconds

  let retries = 0;

  while (retries <= maxRetries) {
    const response = await fetch(targetUrl, {
      headers: {
        // Authorization: "Basic " + btoa(`${username}:${password}`),
        Authorization: "Basic " + btoa(`${""}:${""}`),
      },
    });

    // Check if the request was successful
    if (response.ok) {
      const data = await response.json();
      const rawData: IStateVectorRawData = data;
      const stateVectors = mapRawData(rawData);
      console.log(stateVectors?.states.length);

      if (!stateVectors || !stateVectors.states) {
        return null;
      }

      return stateVectors;
    } else if (response.status === 429) {
      // Rate limit exceeded, retry after the specified time
      const retryAfterSeconds = parseInt(
        response.headers.get("X-Rate-Limit-Retry-After-Seconds") || "3",
        10
      );
      await sleep(retryAfterSeconds * 1000); // Convert seconds to milliseconds

      retries++;
    } else {
      return null;
    }
  }

  return null;
};

//api queries
export const getFlightDetails = async (icao24: string) => {
  const targetUrl = `${baseURL}/states/all?icao24=${icao24}`;
  const response = await fetch(targetUrl, {
    headers: {
      Authorization: "Basic" + btoa(`${username}:${password}`),
    },
  });
  if (response.ok) {
    const data = await response.json();
    const rawData: IStateVectorRawData = data;
    const stateVector = mapRawData(rawData);
    if (!stateVector?.states) {
      return;
    }
    const vector: IStateVector = stateVector.states[0];

    return vector;
  } else {
    return;
  }
};

export const mapRawData = (rawData: IStateVectorRawData) => {
  const stateVectorData: IStateVectorData = {
    time: rawData.time,
    states: [],
  };
  if (!rawData.states) {
    return;
  }
  for (let rawStateVector of rawData.states) {
    const stateVector: IStateVector = {
      icao24: rawStateVector[0],
      callsign: rawStateVector[1],
      origin_country: rawStateVector[2],
      time_position: rawStateVector[3],
      last_contact: rawStateVector[4],
      longitude: rawStateVector[5],
      latitude: rawStateVector[6],
      baro_altitude: rawStateVector[7],
      on_ground: rawStateVector[8],
      velocity: rawStateVector[9],
      true_track: rawStateVector[10],
      vertical_rate: rawStateVector[11],
      sensors: rawStateVector[12],
      geo_altitude: rawStateVector[13],
      squawk: rawStateVector[14],
      spi: rawStateVector[15],
      position_source: rawStateVector[16],
      category: rawStateVector[17],
    };

    stateVectorData.states.push(stateVector);
  }

  return stateVectorData;
};
