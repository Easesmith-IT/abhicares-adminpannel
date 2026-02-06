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

const CityForm = ({
  title = "Add City",
  initialData = {},
  onSubmit,
  isLoading,
}) => {
  const [cityInfo, setCityInfo] = useState({
    city: initialData.city || "",
    state: initialData.state || "",
  });

  const [latitude, setLatitude] = useState(initialData.latitude || 26.5);
  const [longitude, setLongitude] = useState(initialData.longitude || 80.3);
  const [geoFence, setGeoFence] = useState(initialData.geoFence || []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCityInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cityInfo.city || !cityInfo.state) {
      toast.error("City and State are required");
      return;
    }

    onSubmit({
      ...cityInfo,
      latitude,
      longitude,
      geoFence,
    });
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
                  <Label>State</Label>
                  <Input
                    name="state"
                    value={cityInfo.state}
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
