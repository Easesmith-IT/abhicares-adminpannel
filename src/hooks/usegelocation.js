// import  { useState, useEffect } from "react";

// const useGeoLocation = () => {
//   // const [location, setLocation] = useState({
//   //   loaded: false,
//   //   coordinates: { lat: "", lng: "" },
//   // });

//    const [uLocation, setULocation] = useState({
//      geometry: {},
//      formattedAddress: "",
//      city: "",
//      state: "",
//      pincode: "",
//      loaded: false,
//    });

//     const extractAddressComponent = (results, type) => {
//       for (const result of results) {
//         const component = result.address_components.find((component) =>
//           component.types.includes(type)
//         );
//         if (component) {
//           return component.long_name;
//         }
//       }
//       return null;
//     };

//   const onSuccess = (location) => {
//     console.log('inside success')
//     console.log(location.coords.latitude, location.coords.longitude);
//     setULocation((prev) => ({
//       ...prev,
//       // loaded: true,
//       geometry: {
//         lat: location.coords.latitude,
//         lng: location.coords.longitude,
//       },
//     }));
//     // Create a LatLng object for the user's location
//     const userLocation = new window.google.maps.LatLng(
//       location.coords.latitude,
//       location.coords.longitude
//     );

//     // Use the Geocoder to get address details
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: userLocation }, (results, status) => {
//       console.log('results',results)
//       if (status === "OK" && results[0]) {
//         const formattedAddress = results[0].formatted_address;

//         const city = extractAddressComponent(results, "locality");
//         const state = extractAddressComponent(
//           results,
//           "administrative_area_level_1"
//         );
//         const pincode = extractAddressComponent(results, "postal_code");

//         console.log("location up", uLocation);

//         setULocation((prev) => {
//           return {
//             ...prev,
//             formattedAddress,
//             loaded: true,
//             city,
//             state,
//             pincode,
//           };
//         });
//       } else {
//         console.error("Error in geocoding:", status);
//       }
//     });
//   };

//   const onError = (error) => {
//     setULocation({
//       loaded: true,
//       error: {
//         code: error.code,
//         message: error.message,
//       },
//     });
//   };

//   useEffect(() => {
//     if (!("geolocation" in navigator)) {
//       onError({
//         code: 0,
//         message: "Geolocation not supported",
//       });
//     }

//     navigator.geolocation.getCurrentPosition(onSuccess, onError);
//   }, []);

//   return uLocation;
// };

// export default useGeoLocation;


import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    geometry: {},
    formattedAddress: "",
    city:"",
    state:"",
    pincode:"",
  });
  const [status, setStatus] = useState(null);
    const getLocation = async () => {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });

        setStatus(status.state);

        const handlePermission = async () => {
          if (status.state === "granted") {
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
                    console.log('results',results)
                    if (status === "OK" && results[0]) {
                        const formattedAddress =
                          getSuitableFormattedAddress(results);

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
          } else if (status.state === "prompt" || status.state === "denied") {
            // You can handle UI updates or show a message to the user here
            console.error("Geolocation permission denied by the user");

            // Example: Show a button in your modal to request location again
            // This button should trigger the geolocation request
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
                      console.log("results", results);
                      if (status === "OK" && results[0]) {
                        const formattedAddress = getSuitableFormattedAddress(results);
                        const city = extractAddressComponent(
                          results,
                          "locality"
                        );
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
                        console.log("formattedAddress", formattedAddress);
                        console.log("city", city);
                        console.log("state", state);
                        console.log("pincode", pincode);
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
  }

  return { location, status };
};

export default useGeolocation;
