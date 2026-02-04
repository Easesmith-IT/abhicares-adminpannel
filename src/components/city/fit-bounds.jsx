"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FitBounds = ({ polygonCoords }) => {
    const map = useMap();
    
    useEffect(() => {
        if (polygonCoords.length > 0) {
            map.fitBounds(polygonCoords, { padding: [20, 20] });
        }
    }, [polygonCoords, map]);
    
    return null;
};

export default FitBounds;
