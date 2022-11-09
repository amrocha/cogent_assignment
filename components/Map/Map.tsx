import { useEffect, useState } from "react";
import styles from "./Map.module.scss";
import mapboxgl, { Marker } from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1yb2NoYSIsImEiOiJjbDlyODN0bmwwMHQ1M3V0ZWJkY3cxMzMzIn0.POEDg2ATYwa7OtOwxApL0w";

export interface MapProps {
  lat: number;
  lng: number;
  markers: Marker[];
}

export function Map({ lat, lng, markers }: MapProps) {
  let [map, setMap] = useState<mapboxgl.Map>();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: 14,
    });

    newMap.addControl(new mapboxgl.GeolocateControl());
    newMap.addControl(new mapboxgl.NavigationControl());

    newMap.on("mouseenter", "places", (e) => {
      console.log("hello!", e);
    });

    setMap(newMap);
  }, [lat, lng]);

  useEffect(() => {
    markers.forEach((marker) => {
      map && marker.addTo(map);
    });

    return () => {
      markers.forEach((marker) => {
        map && marker.remove();
      });
    };
  });

  return <div className={styles.map} id="map"></div>;
}
