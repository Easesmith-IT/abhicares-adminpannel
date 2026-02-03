import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import useGetApiReq from "../../hooks/useGetApiReq";

const libraries = ["geometry"];

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapContainer = ({ location, sellerStatus, bookingStatus }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries,
  });

  const { res: getPathRes, fetchData: getPath } = useGetApiReq();
  const [path, setPath] = useState([]);
  const [showBackdrop, setShowBackdrop] = useState(false);

  /* ================= SAFETY CHECK ================= */
  if (
    !location ||
    !Array.isArray(location.user) ||
    !Array.isArray(location.seller)
  ) {
    return (
      <div className="h-[500px] flex items-center justify-center text-muted-foreground">
        Location not available
      </div>
    );
  }

  const userLocation = {
    lat: location.user[0],
    lng: location.user[1],
  };

  const sellerLocation = {
    lat: location.seller[0],
    lng: location.seller[1],
  };

  /* ================= FETCH PATH ================= */
  useEffect(() => {
    const source = `${sellerLocation.lat},${sellerLocation.lng}`;
    const dest = `${userLocation.lat},${userLocation.lng}`;

    getPath(
      `/admin/get-the-path-from-source-to-destination?sourceCoordinates=${source}&destinationCoordinates=${dest}`,
    );
  }, []);

  /* ================= DECODE POLYLINE ================= */
  useEffect(() => {
    const points = getPathRes?.data?.routes?.[0]?.overview_polyline?.points;

    if (!points || !window.google?.maps?.geometry) return;

    const decoded = window.google.maps.geometry.encoding.decodePath(points);

    setPath(decoded);
  }, [getPathRes]);

  /* ================= BACKDROP ================= */
  useEffect(() => {
    setShowBackdrop(
      !(sellerStatus === "out-of-delivery" && bookingStatus === "started"),
    );
  }, [sellerStatus, bookingStatus]);

  if (!isLoaded) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading map…
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={userLocation}
      >
        <Marker position={userLocation} />
        <Marker position={sellerLocation} />

        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#4285F4",
              strokeOpacity: 1,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>

      {showBackdrop && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-white text-xl">
          The Seller has not started yet
        </div>
      )}
    </div>
  );
};

export default MapContainer;
