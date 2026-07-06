import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import useGetApiReq from "../../hooks/useGetApiReq";
import { setSelectedAddress } from "../../store/slices/createOrderDraftSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { AddressSkeleton } from "../shared/AddressSkeleton";

const CustomerAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const selectedAddressId = useSelector(
    (state) => state.createOrderDraft.selectedAddress?._id,
  );
  const cartItems = useSelector((state) => state.cart.items);

  const {
    res: getAddressesRes,
    fetchData: getAddresses,
    isLoading,
  } = useGetApiReq();

  const [allAddresses, setAllAddresses] = useState([]);

  const handleAddressSelect = (address) => {
    if (selectedAddressId && selectedAddressId !== address?._id && cartItems.length) {
      dispatch(clearCart());
    }

    dispatch(
      setSelectedAddress({
        customerId: params?.customerId,
        address,
      }),
    );

    navigate(
      `/admin/customers/${params?.customerId}/create-order/userAddresses/categories`,
    );
  };

  useEffect(() => {
    if (params?.customerId) {
      getAddresses(`/admin/get-all-addresses/${params.customerId}`);
    }
  }, [getAddresses, params?.customerId]);

  useEffect(() => {
    if (getAddressesRes?.status !== 200 && getAddressesRes?.status !== 201) {
      return;
    }

    const addresses = getAddressesRes?.data?.addresses || [];
    setAllAddresses(addresses);

    if (!selectedAddressId) {
      const defaultAddress =
        addresses.find((address) => address.defaultAddress) || addresses[0];

      if (defaultAddress) {
        dispatch(
          setSelectedAddress({
            customerId: params?.customerId,
            address: defaultAddress,
          }),
        );
      }
    }
  }, [dispatch, getAddressesRes, params?.customerId, selectedAddressId]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Select the service address first. The city on this address decides the
        available categories, services, and pricing for the full draft.
      </div>

      {isLoading && <AddressSkeleton count={2} />}

      {!isLoading && allAddresses.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          No address found
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {allAddresses.map((address, index) => {
          const isSelected = selectedAddressId === address._id;

          return (
            <Card
              key={address._id}
              onClick={() => handleAddressSelect(address)}
              className={`cursor-pointer border transition ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:bg-muted"
              }`}
            >
              <CardContent className="space-y-2 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Address #{index + 1}</p>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected ? "border-primary" : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>

                {address.defaultAddress && (
                  <span className="text-xs text-green-600">Default address</span>
                )}

                <p>
                  <span className="font-medium">Address:</span>{" "}
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
