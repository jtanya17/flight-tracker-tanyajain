import mapboxgl, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "mapbox-gl";
import "./../map.css";
import { useEffect, useRef, useState } from "react";
import {
  createFeatures,
  getMapGeoBounds,
  getSymbolLayout,
  svgToImage,
} from "../helper/helper";
import { getStateVectors } from "../service/opensky-service";
import { FlightDetails } from "./flight-details";
import { IStateVector } from "../model/opensky-model";
import flightIcon from "./../assets/flight.svg";

interface IMapboxViewProps {
  center: mapboxgl.LngLat;
  zoom: number;
}

//default public token
mapboxgl.accessToken =
  "pk.eyJ1IjoiamFpbnRhbnlhIiwiYSI6ImNsa2RjNThnczB1cmczbG82eDdyc2RwZ2MifQ.s3lQggqVTrgZbIxmWm41mA";

export const MapView = (props: IMapboxViewProps) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map>();
  const [icao24, setIcao24] = useState<string>("");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const svgImage = { flightIcon };
  const iconName = "flight-icon";
  useEffect(() => {
    if (!mapInstance) {
      if (!mapContainer.current) {
        return;
      }

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: props.center,
        zoom: props.zoom,
        style: "mapbox://styles/mapbox/outdoors-v12",
      });

      map.on("load", async () => {
        const img = await svgToImage(svgImage.flightIcon, 18, 18);
        map.addImage(iconName, img as HTMLImageElement, { sdf: true });
        //load state vector
        const bounds = getMapGeoBounds(map.getBounds());
        const stateVectors = await getStateVectors(bounds);
        console.log(stateVectors?.states.length);
        if (!stateVectors) {
          return;
        }
        const features = createFeatures(stateVectors) as string;
        map.addSource("flight-source", {
          type: "geojson",
          data: features,
        });

        map.addLayer({
          id: "flight-layer",
          type: "symbol",
          source: "flight-source",
          layout: getSymbolLayout(map.getZoom()),
        });

        map.addControl(
          new NavigationControl({
            showCompass: true,
            showZoom: true,
          }),
          "bottom-right"
        );

        map.addControl(new FullscreenControl(), "top-right");

        map.addControl(
          new GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "bottom-right"
        );
      });

      map.on("mouseenter", "flight-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "flight-layer", (e) => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "flight-layer", (e) => {
        e.preventDefault();
        const icao24 = e.features![0].properties?.icao24;
        const fromOrigin = e.features![0].properties?.origin;
        new mapboxgl.Popup({ closeButton: false })
          .setLngLat(e.lngLat)
          .setHTML(
            "<div><strong>" + icao24 + "</strong><br/>" + fromOrigin + "</div>"
          )
          .addTo(map);

        setIcao24(icao24);
        //setShowDetail(true);
      });

      setMapInstance(map);
    }

    const updateData = setInterval(() => {
      updateFlight();
    }, 12000);

    return () => {
      clearInterval(updateData);
    };
  }, [mapInstance]);

  const updateFlight = async () => {
    if (!mapInstance) {
      return;
    }
    const bounds = getMapGeoBounds(mapInstance.getBounds());
    const stateVectors = await getStateVectors(bounds);
    if (!stateVectors) {
      return;
    }
    const features = createFeatures(stateVectors) as string;
    const source: mapboxgl.GeoJSONSource = mapInstance.getSource(
      "flight-source"
    ) as mapboxgl.GeoJSONSource;

    if (!source) {
      return;
    }
    source.setData(features);

    if (mapInstance.getLayer("flight-layer")) {
      mapInstance.removeLayer("flight-layer");
      mapInstance.addLayer({
        id: "flight-layer",
        type: "symbol",
        source: "flight-source",
        layout: getSymbolLayout(mapInstance.getZoom()),
      });
    }
  };
  return (
    <div className="root">
      <div className="map-root" ref={mapContainer}></div>
      <FlightDetails icao24={icao24} />
    </div>
  );
};
