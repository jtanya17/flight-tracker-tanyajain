import {
  Feature,
  Feature as GeoJsonFeature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
  Position,
} from "geojson";
import mapboxgl, { Expression, StyleFunction, SymbolLayout } from "mapbox-gl";
import { startTransition } from "react";
import {
  IMapGeoBounds,
  IStateVector,
  IStateVectorData,
} from "../model/opensky-model";

//convert flight icon svg to an image to be plotted on the mapbox
export const svgToImage = (path: string, width: number, height: number) => {
  return new Promise((resolve) => {
    const image = new Image(width, height);
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = path;
  });
};

//fetch geographical bounds based on north, south lat and east, west long parameters
export const getMapGeoBounds = (bounds: mapboxgl.LngLatBounds) => {
  let mapGeoBounds: IMapGeoBounds = {
    northernLatitude: 0.0,
    southernLatitude: 0.0,
    easternLongitude: 0.0,
    westernLongitude: 0.0,
  };
  mapGeoBounds.northernLatitude = bounds!.getNorthEast().lat;
  mapGeoBounds.easternLongitude = bounds!.getNorthEast().lng;
  mapGeoBounds.southernLatitude = bounds!.getSouthWest().lat;
  mapGeoBounds.westernLongitude = bounds!.getSouthWest().lng;

  return mapGeoBounds;
};

//features to show on flight icon popup - callsign and ICAO24
export const createFeatures = (
  stateVectors: IStateVectorData | undefined
):
  | String
  | FeatureCollection<Geometry, GeoJsonProperties>
  | Feature<Geometry, GeoJsonProperties> => {
  if (!stateVectors) {
    return "";
  }

  if (!stateVectors.states) {
    return "";
  }

  let featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  for (let stateVector of stateVectors.states) {
    if (!stateVector.latitude) {
      continue;
    }
    if (!stateVector.longitude) {
      continue;
    }
    const index = stateVectors.states.indexOf(stateVector);
    const callsign = stateVector.callsign
      ? stateVector.callsign
      : stateVector.icao24;
    let altitude = stateVector.geo_altitude;
    if (altitude == null || altitude < 0) {
      altitude = stateVector.baro_altitude;
    }

    if (altitude === null || altitude < 0) {
      altitude = 0;
    }

    const vel = stateVector.velocity ? stateVector.velocity * 3.6 : -1;
    const trueTrack = stateVector.true_track ? stateVector.true_track : 0.0;
    const verticalRate = stateVector.vertical_rate
      ? stateVector.vertical_rate
      : 0.0;
    const isOnGround = stateVector.on_ground;
    let color = getColor(altitude);
    if (isOnGround) {
      color = "#e3f2fd";
    }
    let properties: GeoJsonProperties = {
      iconName: getIconName(verticalRate, altitude, trueTrack),
      rotation: getRotation(verticalRate, altitude, trueTrack),
      color: color,
      icao24: stateVector.icao24,
      callsign: callsign,
      altitude: altitude + "m",
      velocity: vel + "km/h",
      origin: stateVector.origin_country,
    };

    let position: Position = [stateVector.longitude, stateVector.latitude];

    let point: Point = {
      type: "Point",
      coordinates: position,
    };

    let feature: Feature<Point, GeoJsonProperties> = {
      type: "Feature",
      id: `${index}.${stateVector.icao24}`,
      geometry: point,
      properties: properties,
    };

    featureCollection.features.push(feature);
  }

  return featureCollection;
};

export const getSymbolLayout = (zoom: number) => {
  let showText = false;
  if (zoom && zoom > 7) {
    showText = true;
  }

  let iconSize = 1.0;
  if (zoom > 6) {
    iconSize = 1.2;
  } else if (zoom > 8) {
    iconSize = 1.5;
  }

  //adjust symbol layout based on current zoom
  const symbolLayout: SymbolLayout = {
    "icon-image": ["get", "iconName"],
    "icon-allow-overlap": true,
    "icon-rotate": ["get", "rotation"],
    "icon-size": iconSize,
    "text-field": showText ? getText() : "",
    "text-optional": true,
    "text-allow-overlap": true,
    "text-anchor": showText ? "top" : "center",
    "text-offset": showText ? [0, 1] : [0, 0],
  };

  return symbolLayout;
};

//text to show on the flight icon popup
export const getText = () => {
  let text: string | Expression | StyleFunction = [
    "format",
    ["get", "callsign"],
    { "font-scale": 1.0 },
    "\n",
    {},
    ["get", "altitude"],
    { "font-scale": 0.75, "text-color": "#fff" },
    "\n",
    {},
    ["get", "velocity"],
    { "font-scale": 0.75, "text-color": "#fff" },
  ] as StyleFunction;

  return text;
};

export const getIconName = (
  verticalRate: number,
  altitude: number,
  trueTrack: number
) => {
  let iconName: string = "flight-icon";
  return iconName;
};

//turn flight icon in direction of 
export const getRotation = (
  verticalRate: number,
  altitude: number,
  trueTrack: number
) => {
  let rotation: number = 0.0;
  if (verticalRate > 0 && altitude < 1000) {
    return rotation;
  } else if (verticalRate < 0 && altitude < 1000) {
    return rotation;
  } else {
    return trueTrack;
  }
};
