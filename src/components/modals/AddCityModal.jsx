import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CityGeoFenceMap from "../city/city-geo-fence-map";

const AddCityModal = ({ setIsModalOpen, city = "", getAllCities }) => {
  const {
    res: addCityRes,
    fetchData: addCity,
    isLoading: addCityLoading,
  } = usePostApiReq();

  const { res: updateCityRes, fetchData: updateCityFetchData } =
    usePatchApiReq();

  const [cityInfo, setCityInfo] = useState({
    city: city?.city || "",
    state: city?.state || "",
    pinCode: "",
  });

  const [latitude, setLatitude] = useState(city?.latitude || 26.5);
  const [longitude, setLongitude] = useState(city?.longitude || 80.3);
  const [geoFence, setGeoFence] = useState(city?.geoFence || []);
  const [pinCodes, setPinCodes] = useState(city?.pinCodes || []);

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

  const handleAddPincode = () => {
    if (!cityInfo.pinCode) {
      toast.error("Please enter a pincode");
      return;
    }

    if (cityInfo.pinCode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setPinCodes((prev) => [...prev, { code: cityInfo.pinCode }]);
    setCityInfo((prev) => ({ ...prev, pinCode: "" }));
  };

  const handleRemovePincode = (index) => {
    setPinCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cityInfo.city || !cityInfo.state || pinCodes.length === 0) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      ...cityInfo,
      pinCodes,
      latitude,
      longitude,
      geoFence,
    };

    if (city) {
      updateCityFetchData(`/admin/update-availabe-city/${city._id}`, payload);
    } else {
      addCity("/admin/create-availabe-city", payload);
    }
  };

  useEffect(() => {
    if (addCityRes?.status === 200 || addCityRes?.status === 201) {
      // toast.success("City added successfully");
      getAllCities();
      setIsModalOpen(false);
    }
  }, [addCityRes]);

  useEffect(() => {
    if (updateCityRes?.status === 200 || updateCityRes?.status === 201) {
      // toast.success("City updated successfully");
      getAllCities();
      setIsModalOpen(false);
    }
  }, [updateCityRes]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {city ? "Update City" : "Add City"}
          </DialogTitle>
        </DialogHeader>

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
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Add Pincodes</Label>
            <div className="flex gap-2">
              <Input
                name="pinCode"
                type="number"
                value={cityInfo.pinCode}
                onChange={handleChange}
              />
              <Button
                variant="abhicares"
                type="button"
                onClick={handleAddPincode}
              >
                Add
              </Button>
            </div>

            {pinCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pinCodes.map((p, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {p.code}
                    <X
                      className="h-3.5 w-3.5 cursor-pointer"
                      onClick={() => handleRemovePincode(i)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <CityGeoFenceMap
            latitude={latitude}
            longitude={longitude}
            polygon={geoFence}
            polygonCoords={geoFence}
            onChange={setGeoFence}
          />

          <div className="flex justify-end">
            <Button variant="abhicares" type="submit" disabled={addCityLoading}>
              {addCityLoading ? "Saving..." : city ? "Update City" : "Add City"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCityModal;
