import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { Card, CardContent } from "@/components/ui/card";

import FitBounds from "./fit-bounds";
import MapSetView from "./map-set-view";

const CityGeoFenceMap = ({
  latitude,
  longitude,
  polygon = [],
  onChange,
  polygonCoords = [],
}) => {
  const featureGroupRef = useRef(null);

  const hasPolygon = polygon.length > 0;

  // ✅ Load polygon imperatively
  useEffect(() => {
    if (!featureGroupRef.current) return;

    featureGroupRef.current.clearLayers();

    if (!hasPolygon) return;

    const layer = L.polygon(polygon, {
      color: "#2563eb",
      weight: 2,
    });

    featureGroupRef.current.addLayer(layer);
  }, [polygon, hasPolygon]);

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          <MapContainer
            center={[latitude, longitude]}
            zoom={12}
            className="h-full w-full"
          >
            <Marker position={[latitude, longitude]}>
              <Popup>City Center</Popup>
            </Marker>
            <MapSetView latitude={latitude} longitude={longitude} />

            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                key={hasPolygon ? "edit-enabled" : "draw-enabled"} // 🔥 CRITICAL FIX
                position="topleft"
                draw={{
                  polygon: hasPolygon
                    ? false
                    : {
                        allowIntersection: false,
                        showArea: false,
                        shapeOptions: {
                          color: "#2563eb",
                        },
                      },
                  rectangle: false,
                  circle: false,
                  polyline: false,
                  marker: false,
                  circlemarker: false,
                }}
                edit={
                  hasPolygon
                    ? {
                        edit: {
                          selectedPathOptions: {
                            maintainColor: true,
                            color: "#2563eb",
                          },
                        },
                        remove: true,
                      }
                    : false
                }
                onCreated={(e) => {
                  const latlngs = e.layer.getLatLngs()[0];
                  onChange(latlngs.map((p) => [p.lat, p.lng]));
                }}
                onEdited={(e) => {
                  const layer = Object.values(e.layers._layers)[0];
                  const latlngs = layer.getLatLngs()[0];
                  onChange(latlngs.map((p) => [p.lat, p.lng]));
                }}
                onDeleted={() => onChange([])}
              />
            </FeatureGroup>

            <FitBounds polygonCoords={polygonCoords} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityGeoFenceMap;
