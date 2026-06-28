import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    geometry: {},
    formattedAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [status, setStatus] = useState(null);

  const getLocation = async () => {
    try {
      const statusObj = await navigator.permissions.query({
        name: "geolocation",
      });

      setStatus(statusObj.state);

      const handlePermission = async () => {
        if (statusObj.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation((prev) => {
                return {
                  ...prev,
                  geometry: { lat: latitude, lng: longitude },
                };
              });

              // Create a LatLng object for the user's location
              const userLocation = new window.google.maps.LatLng(
                latitude,
                longitude
              );

              // Use the Geocoder to get address details
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode(
                { location: userLocation },
                (results, status) => {
                  if (status === "OK" && results[0]) {
                    const formattedAddress = getSuitableFormattedAddress(results);
                    const city = extractAddressComponent(results, "locality");
                    const state = extractAddressComponent(
                      results,
                      "administrative_area_level_1"
                    );
                    const pincode = extractAddressComponent(
                      results,
                      "postal_code"
                    );

                    setLocation((prev) => {
                      return {
                        ...prev,
                        formattedAddress,
                        city,
                        state,
                        pincode,
                      };
                    });
                  } else {
                    console.error("Error in geocoding:", status);
                  }
                }
              );
            },
            (error) => {
              console.error("Error in getting location", error.message);
            }
          );
        } else if (statusObj.state === "prompt" || statusObj.state === "denied") {
          console.error("Geolocation permission denied by the user");

          const requestLocationAgain = async () => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation((prev) => {
                  return {
                    ...prev,
                    geometry: { lat: latitude, lng: longitude },
                  };
                });

                const userLocation = new window.google.maps.LatLng(
                  latitude,
                  longitude
                );

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode(
                  { location: userLocation },
                  (results, status) => {
                    if (status === "OK" && results[0]) {
                      const formattedAddress = getSuitableFormattedAddress(results);
                      const city = extractAddressComponent(results, "locality");
                      const state = extractAddressComponent(
                        results,
                        "administrative_area_level_1"
                      );
                      const pincode = extractAddressComponent(
                        results,
                        "postal_code"
                      );

                      setLocation((prev) => {
                        return {
                          ...prev,
                          formattedAddress,
                          city,
                          state,
                          pincode,
                        };
                      });
                    } else {
                      console.error("Error in geocoding:", status);
                    }
                  }
                );
              },
              (error) => {
                console.error("Error in getting location", error.message);
              }
            );
          };

          await requestLocationAgain();
        }
      };

      await handlePermission();
    } catch (error) {
      console.error("Error checking geolocation permission:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const extractAddressComponent = (results, type) => {
    for (const result of results) {
      const component = result.address_components.find((component) =>
        component.types.includes(type)
      );
      if (component) {
        return component.long_name;
      }
    }
    return null;
  };

  const getSuitableFormattedAddress = (results) => {
    for (const result of results) {
      if (
        result.types.includes("street_address") ||
        result.types.includes("route")
      )
        return result.formatted_address;
    }
    return results[0].formatted_address;
  };

  return { location, status };
};

export default useGeolocation;
