import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import CityGeoFenceMap from "../city/city-geo-fence-map";
import { Card, CardContent } from "../ui/card";
import { BackLink } from "../shared/back-link";
import { H2 } from "../shared/typography";
import * as turf from "@turf/turf";

// Helper to calculate the center of a polygon
export const getPolygonCenter = (latLngArray) => {
  if (!latLngArray || latLngArray.length < 3) return null;
  const coords = latLngArray.map(([lat, lng]) => [lng, lat]);
  const closed = [...coords];
  if (
    closed[0][0] !== closed[closed.length - 1][0] ||
    closed[0][1] !== closed[closed.length - 1][1]
  ) {
    closed.push(closed[0]);
  }
  try {
    const poly = turf.polygon([closed]);
    let centerPoint = turf.centroid(poly);
    if (!turf.booleanPointInPolygon(centerPoint, poly)) {
      centerPoint = turf.pointOnFeature(poly);
    }
    return {
      latitude: Number(centerPoint.geometry.coordinates[1].toFixed(7)),
      longitude: Number(centerPoint.geometry.coordinates[0].toFixed(7)),
    };
  } catch (err) {
    console.error("Error calculating polygon center:", err);
    return null;
  }
};

const CityForm = ({
  title = "Add City",
  initialData = {},
  onSubmit,
  isLoading,
}) => {
  const [cityInfo, setCityInfo] = useState({
    city: initialData.name || "",
  });

  const [latitude, setLatitude] = useState(initialData.latitude || 26.5);
  const [longitude, setLongitude] = useState(initialData.longitude || 80.3);
  const [geoFence, setGeoFence] = useState(
    initialData?.area?.coordinates?.[0]?.length >= 3
      ? initialData?.area?.coordinates?.[0].map(([lng, lat]) => [lat, lng])
      : [],
  );

  /* Auto fetch lat/long on city change (ONLY for new cities without existing geofence) */
  useEffect(() => {
    // If updating existing city, never overwrite coordinates with Nominatim geocoding
    if (initialData?._id) return;
    if (!cityInfo.city) return;
    if (geoFence.length >= 3) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInfo.city)}`,
        );
        const data = await res.json();

        if (data?.length) {
          setLatitude(Number(Number(data[0].lat).toFixed(7)));
          setLongitude(Number(Number(data[0].lon).toFixed(7)));
        }
      } catch (err) {
        console.error(err);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [cityInfo.city, initialData?._id, geoFence.length]);

  /* Populate form when initialData loads */
  useEffect(() => {
    if (!initialData?._id) return;

    setCityInfo({ city: initialData.name || "" });

    const hasPolygon = initialData?.area?.coordinates?.[0]?.length >= 3;
    let initialGeo = [];
    if (hasPolygon) {
      initialGeo = initialData.area.coordinates[0].map(([lng, lat]) => [lat, lng]);
      setGeoFence(initialGeo);
    }

    let lat = initialData.latitude;
    let lng = initialData.longitude;

    // Check if initial latitude/longitude is actually inside the polygon
    if (hasPolygon && lat !== undefined && lng !== undefined) {
      const polygonCoords = initialGeo.map(([lt, lg]) => [lg, lt]);
      if (
        polygonCoords[0][0] !== polygonCoords.at(-1)[0] ||
        polygonCoords[0][1] !== polygonCoords.at(-1)[1]
      ) {
        polygonCoords.push(polygonCoords[0]);
      }
      const pt = turf.point([lng, lat]);
      const ply = turf.polygon([polygonCoords]);
      if (!turf.booleanPointInPolygon(pt, ply)) {
        // Automatically recalibrate to polygon center
        const center = getPolygonCenter(initialGeo);
        if (center) {
          lat = center.latitude;
          lng = center.longitude;
        }
      }
    }

    if (lat !== undefined) setLatitude(lat);
    if (lng !== undefined) setLongitude(lng);
  }, [initialData]);

  // Handle polygon change (when drawn or edited) and automatically update center lat/lng
  const handlePolygonChange = useCallback((newCoords) => {
    setGeoFence(newCoords);
    if (newCoords && newCoords.length >= 3) {
      const center = getPolygonCenter(newCoords);
      if (center) {
        setLatitude(center.latitude);
        setLongitude(center.longitude);
      }
    }
  }, []);

  const handleRecenterToPolygon = () => {
    if (!geoFence || geoFence.length < 3) {
      toast.error("Please draw a valid geo-fence first");
      return;
    }
    const center = getPolygonCenter(geoFence);
    if (center) {
      setLatitude(center.latitude);
      setLongitude(center.longitude);
      toast.success("Coordinates updated to polygon center");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCityInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cityInfo.city) {
      toast.error("City name is required");
      return;
    }

    if (!geoFence || geoFence.length < 3) {
      toast.error("Please draw a valid geo-fence");
      return;
    }

    const polygonCoords = geoFence.map(([lat, lng]) => [lng, lat]);

    // close polygon
    if (
      polygonCoords[0][0] !== polygonCoords.at(-1)[0] ||
      polygonCoords[0][1] !== polygonCoords.at(-1)[1]
    ) {
      polygonCoords.push(polygonCoords[0]);
    }

    let finalLat = latitude;
    let finalLng = longitude;

    const point = turf.point([finalLng, finalLat]);
    const polygon = turf.polygon([polygonCoords]);

    if (!turf.booleanPointInPolygon(point, polygon)) {
      // Auto-correct to polygon center
      const center = getPolygonCenter(geoFence);
      if (center) {
        finalLat = center.latitude;
        finalLng = center.longitude;
        setLatitude(finalLat);
        setLongitude(finalLng);
        toast.info("Adjusted city center to inside polygon boundary");
      } else {
        toast.error("Selected latitude/longitude is outside polygon boundary");
        return;
      }
    }

    const payload = {
      name: cityInfo.city,
      latitude: finalLat,
      longitude: finalLng,
      polygon: polygonCoords,
    };

    onSubmit(payload);
  };

  return (
    <div>
      <div className="mb-6">
        <BackLink href={-1}>
          <H2>{title}</H2>
        </BackLink>
        <p className="text-sm text-muted-foreground">
          Define city details and draw its geo-fence
        </p>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto max-w-6xl">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={cityInfo.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Latitude</Label>
                    {geoFence.length >= 3 && (
                      <button
                        type="button"
                        onClick={handleRecenterToPolygon}
                        className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        Center on Polygon
                      </button>
                    )}
                  </div>
                  <Input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  💡 <strong>Tip:</strong> Drag the blue pin 📍 to adjust city center, or edit the polygon to automatically update coordinates.
                </span>
              </div>

              <Separator />

              {/* Geo Fence Map */}
              <CityGeoFenceMap
                latitude={latitude}
                longitude={longitude}
                polygon={geoFence}
                polygonCoords={geoFence}
                onChange={handlePolygonChange}
                onLocationChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="abhicares" type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save City"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CityForm;
