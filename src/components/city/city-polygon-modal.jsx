"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FitBounds from "./fit-bounds";


export const CityPolygonModal = ({ city, isOpen, onClose }) => {
  const polygonCoords =
    city?.area?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{city?.city} – Geo Fence</DialogTitle>
        </DialogHeader>

        <div className="h-[400px] w-full rounded-md overflow-hidden">
          <MapContainer
            center={[city.latitude, city.longitude]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {polygonCoords.length > 0 && (
              <>
                <Polygon positions={polygonCoords} />
                <FitBounds polygonCoords={polygonCoords} />
              </>
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
