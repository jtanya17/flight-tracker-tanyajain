import mapboxgl from "mapbox-gl";
import { MapView } from "./map-view";
import "./../map.css";
export const MapboxHome = () => {
  return (
    <div className="root">
      <MapView
        //center={new mapboxgl.LngLat(40.712776, -74.005974)} //New York
        center={new mapboxgl.LngLat(4.0778828, 49.724997)} //France/Belgium
        //center={new mapboxgl.LngLat(32.06826, -71.88823)}
        zoom={4}
      ></MapView>
    </div>
  );
};
