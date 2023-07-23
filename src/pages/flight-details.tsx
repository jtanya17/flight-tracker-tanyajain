import moment from "moment";
import { useEffect, useState } from "react";
import { IStateVector } from "../model/opensky-model";
import { getFlightDetails } from "../service/opensky-service";
import "./../map.css";
interface ILocalProps {
  icao24: string;
}
type Props = ILocalProps;
export const FlightDetails = (props: Props) => {
  const [stateVector, setStateVector] = useState<IStateVector>();
  //useEffect hook to fetch flight details when the component is mounted
  useEffect(() => {
    const flightDetails = async () => {
      const detail = await getFlightDetails(props.icao24);
      if (!detail) {
        return;
      }
      setStateVector(detail);
    };
    flightDetails();
    // Setting an interval to fetch flight details every 6 seconds
    const interval = setInterval(() => flightDetails(), 6000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    //render flight info
    <div className="flight-detail-box">
      <div className="card-root">
        <div className="card-header flex-row justify-content-between">
          <div>
            <svg
              xmlns="https://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              fill="#fff"
              width="24"
              style={{ fill: "black" }}
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l2.3-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>{" "}
            Parameter
          </div>
          <div>{stateVector?.icao24}</div>
        </div>
        <div className="card-body flex-column">
          <div className="info-box flex-row justify-content-between">
            <div>Last Contact</div>
            <div>
              {moment
                .unix(stateVector ? stateVector.last_contact : 0)
                .fromNow()}
            </div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Origin Country</div>
            <div> {stateVector?.origin_country}</div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Velocity</div>
            <div>
              {stateVector?.velocity} m/s OR{" "}
              {(stateVector?.velocity! * 3.6).toFixed(2)} km/h
            </div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Geometric Altitude</div>
            <div>
              {parseFloat((stateVector?.geo_altitude! / 0.3048).toFixed(2))} ft
              OR ({stateVector?.geo_altitude})
            </div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Barometric Altitude</div>
            <div>
              {parseFloat((stateVector?.baro_altitude! / 0.3048).toFixed(2))} ft
              OR ({stateVector?.baro_altitude})
            </div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Vertical Rate</div>
            <div>{stateVector?.vertical_rate}</div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Squawk</div>
            <div>{stateVector?.squawk}</div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Position Source</div>
            <div>{stateVector?.position_source}</div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>Aircraft Category</div>
            <div>{stateVector?.category}</div>
          </div>
          <div className="info-box flex-row justify-content-between">
            <div>ICAO24</div>
            <div>{stateVector?.icao24}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
