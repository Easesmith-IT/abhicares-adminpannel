import { useEffect, useState } from "react";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

const UserAddressModal = ({ setIsModalOpen, userId }) => {
  const {
    res: getAddressesRes,
    fetchData: getAddresses,
    isLoading,
  } = useGetApiReq();

  const [allAddresses, setAllAddresses] = useState([]);

  const getAllAddress = () => {
    getAddresses(`/admin/get-all-addresses/${userId}`);
  };

  useEffect(() => {
    getAllAddress();
  }, []);

  useEffect(() => {
    if (getAddressesRes?.status === 200 || getAddressesRes?.status === 201) {
      setAllAddresses(getAddressesRes?.data?.addresses || []);
    }
  }, [getAddressesRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>User Addresses</DialogTitle>
        </DialogHeader>

        <Separator />

        {/* Loading */}
        {isLoading && <AddressSkeleton count={3} />}

        {/* Empty */}
        {!isLoading && allAddresses.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No address found
          </p>
        )}

        {/* Addresses */}
        <div className="space-y-4 grid grid-cols-2 gap-5">
          {allAddresses.map((address, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Address #{index + 1}</p>
                  {address.defaultAddress && (
                    <Badge className="bg-green-600">Default</Badge>
                  )}
                </div>

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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddressModal;

const AddressSkeleton = ({ count = 3 }) => (
  <div className="space-y-4 grid grid-cols-2 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);
