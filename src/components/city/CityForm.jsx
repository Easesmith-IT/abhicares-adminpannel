import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import CityGeoFenceMap from "../city/city-geo-fence-map";
import { Card, CardContent } from "../ui/card";
import { BackLink } from "../shared/back-link";
import { H2 } from "../shared/typography";
import * as turf from "@turf/turf";

const CityForm = ({
  title = "Add City",
  initialData = {},
  onSubmit,
  isLoading,
}) => {
  console.log("initialData", initialData);

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

  console.log("geoFence", geoFence);

  /* Auto fetch lat/long on city change */
  useEffect(() => {
    if (!cityInfo.city) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${cityInfo.city}`,
        );
        const data = await res.json();

        if (data?.length) {
          setLatitude(Number(data[0].lat));
          setLongitude(Number(data[0].lon));
        }
      } catch (err) {
        console.error(err);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [cityInfo.city]);

  useEffect(() => {
    if (!initialData?._id) return;

    setCityInfo({ city: initialData.name || "" });
    setLatitude(initialData.latitude);
    setLongitude(initialData.longitude);

    if (initialData?.area?.coordinates?.[0]?.length >= 3) {
      setGeoFence(
        initialData.area.coordinates[0].map(([lng, lat]) => [lat, lng]),
      );
    }
  }, [initialData]);

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

    const point = turf.point([longitude, latitude]);

    const polygon = turf.polygon([polygonCoords]);

    if (!turf.booleanPointInPolygon(point, polygon)) {
      toast.error("Selected latitude/longitude is outside polygon boundary");
      return;
    }

    const payload = {
      name: cityInfo.city,
      latitude,
      longitude,
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
            {/* Page Header */}

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
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              {/* Geo Fence Map */}
              <CityGeoFenceMap
                latitude={latitude}
                longitude={longitude}
                polygon={geoFence}
                polygonCoords={geoFence}
                onChange={setGeoFence}
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
