import React, { useEffect, useState } from "react";
import useGetApiReq from "../../hooks/useGetApiReq";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressSkeleton } from "../shared/AddressSkeleton";

const CustomerAddresses = ({ selectedId, onSelect = () => {} }) => {

  const {
    res: getAddressesRes,
    fetchData: getAddresses,
    isLoading,
  } = useGetApiReq();

  const params = useParams();
  const navigate = useNavigate();
  const [allAddresses, setAllAddresses] = useState([]);

  const handleAddressSelect = (address) => {
    onSelect(address?._id);
    navigate(
      `/admin/customers/${params?.customerId}/create-order/userAddresses/categories`,
      { state: { address } },
    );
  };

  useEffect(() => {
    getAddresses(`/admin/get-all-addresses/${params?.customerId}`);
  }, []);

  useEffect(() => {
    if (getAddressesRes?.status === 200 || getAddressesRes?.status === 201) {
      const addresses = getAddressesRes?.data?.addresses || [];
      setAllAddresses(addresses);

      // ✅ Auto select default address
      const defaultAddr = addresses.find((a) => a.defaultAddress);
      if (defaultAddr && !selectedId) {
        onSelect(defaultAddr._id);
      }
    }
  }, [getAddressesRes]);

  return (
    <div>
      {isLoading && <AddressSkeleton count={2} />}

      {!isLoading && allAddresses.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No address found
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {allAddresses.map((address, index) => {
          const isSelected = selectedId === address._id;

          return (
            <Card
              key={address._id}
              onClick={() => handleAddressSelect(address)}
              className={`cursor-pointer transition border
          ${
            isSelected
              ? "border-primary bg-primary/5 ring-2 ring-primary"
              : "hover:bg-muted"
          }`}
            >
              <CardContent className="p-4 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Address #{index + 1}</p>

                  {/* ✅ Selection Indicator (like radio) */}
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center
                ${isSelected ? "border-primary" : "border-gray-400"}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>

                {address.defaultAddress && (
                  <span className="text-xs text-green-600">Default</span>
                )}

                <p>
                  <span className="font-medium">Address Line:</span>{" "}
                  {address.addressLine}
                </p>
                <p>
                  <span className="font-medium">Landmark:</span>{" "}
                  {address.landmark || "-"}
                </p>
                <p>
                  <span className="font-medium">City:</span> {address.city}
                </p>
                <p>
                  <span className="font-medium">Pincode:</span>{" "}
                  {address.pincode}
                </p>
                <p>
                  <span className="font-medium">Coordinates:</span>{" "}
                  {address.location?.coordinates?.[0]},{" "}
                  {address.location?.coordinates?.[1]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerAddresses;
