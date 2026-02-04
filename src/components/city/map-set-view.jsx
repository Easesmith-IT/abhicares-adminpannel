"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapSetView = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 12, {
        animate: true,
      });
    }
  }, [latitude, longitude, map]);

  return null;
};

export default MapSetView;
