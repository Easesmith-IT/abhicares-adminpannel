import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import usePostApiReq from "../../hooks/usePostApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

const AddSellerModal = ({ setIsModalOpen, seller = null, getAllSellers }) => {
  const { res: addRes, fetchData: addSeller, isLoading } = usePostApiReq();
  const {
    res: updateRes,
    fetchData: updateSeller,
    isLoading: isUpdateLoading,
  } = usePatchApiReq();
  const { res: catRes, fetchData: getCategories } = useGetApiReq();
  const {
    res: serviceRes,
    fetchData: getServices,
    isLoading: serviceLoading,
  } = useGetApiReq();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [sellerInfo, setSellerInfo] = useState({
    name: seller?.name || "",
    legalName: seller?.legalName || "",
    gstNumber: seller?.gstNumber || "",
    phone: seller?.phone || "",
    password: "",
    status: seller?.status || "",
    categoryId: seller?.categoryId?._id || "",
    services:
      seller?.services?.map((s) => ({
        serviceId: s?.serviceId?._id,
        name: s?.serviceId?.name,
      })) || [],
  });

  const [address, setAddress] = useState({
    state: seller?.address?.state || "",
    city: seller?.address?.city || "",
    pincode: seller?.address?.pincode || "",
    addressLine: seller?.address?.addressLine || "",
  });

  const [coords, setCoords] = useState({
    latitude: seller?.address?.location?.coordinates?.[0] || "",
    longitude: seller?.address?.location?.coordinates?.[1] || "",
  });

  const [contact, setContact] = useState({
    name: seller?.contactPerson?.name || "",
    phone: seller?.contactPerson?.phone || "",
    email: seller?.contactPerson?.email || "",
  });

  /* Fetch categories */
  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (catRes?.status === 200) setCategories(catRes.data.data);
  }, [catRes]);

  /* Fetch services */
  useEffect(() => {
    if (sellerInfo.categoryId) {
      getServices(`/admin/get-category-service/${sellerInfo.categoryId}`);
    }
  }, [sellerInfo.categoryId]);

  useEffect(() => {
    if (serviceRes?.status === 200) setServices(serviceRes.data.data);
  }, [serviceRes]);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !sellerInfo.name ||
      !sellerInfo.legalName ||
      !sellerInfo.gstNumber ||
      !sellerInfo.phone ||
      (!seller && !sellerInfo.password) ||
      !sellerInfo.categoryId ||
      sellerInfo.services.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...sellerInfo,
      address: {
        ...address,
        location: {
          type: "Point",
          coordinates: [coords.latitude, coords.longitude],
        },
      },
      contactPerson: contact,
    };

    seller
      ? updateSeller(`/admin/update-seller/${seller._id}`, payload)
      : addSeller("/admin/create-seller", payload);
  };

  useEffect(() => {
    if (addRes?.status === 200 || updateRes?.status === 200) {
      // toast.success(`Seller ${seller ? "updated" : "created"} successfully`);
      getAllSellers();
      setIsModalOpen(false);
    }
  }, [addRes, updateRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{seller ? "Update Partner" : "Add Partner"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seller Info */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={sellerInfo.name}
                  onChange={(e) =>
                    setSellerInfo({ ...sellerInfo, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Legal Name</Label>
                <Input
                  value={sellerInfo.legalName}
                  onChange={(e) =>
                    setSellerInfo({
                      ...sellerInfo,
                      legalName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input
                  value={sellerInfo.gstNumber}
                  onChange={(e) =>
                    setSellerInfo({
                      ...sellerInfo,
                      gstNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={sellerInfo.phone}
                  onChange={(e) =>
                    setSellerInfo({ ...sellerInfo, phone: e.target.value })
                  }
                />
              </div>

              {!seller && (
                <div className="space-y-2 col-span-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={sellerInfo.password}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* Status & Category */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={sellerInfo.status}
                  onValueChange={(v) =>
                    setSellerInfo({ ...sellerInfo, status: v })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN-REVIEW">In Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="HOLD">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={sellerInfo.categoryId}
                  onValueChange={(v) =>
                    setSellerInfo({
                      ...sellerInfo,
                      categoryId: v,
                      services: [],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <Label>Services</Label>
              {serviceLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {services.map((s) => (
                    <label
                      key={s._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={sellerInfo.services.some(
                          (x) => x.serviceId === s._id,
                        )}
                        onCheckedChange={(checked) =>
                          setSellerInfo({
                            ...sellerInfo,
                            services: checked
                              ? [
                                  ...sellerInfo.services,
                                  { serviceId: s._id, name: s.name },
                                ]
                              : sellerInfo.services.filter(
                                  (x) => x.serviceId !== s._id,
                                ),
                          })
                        }
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={address.addressLine}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    addressLine: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <Input
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
              <Input
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-5">
              <Input
                placeholder="Latitude"
                value={coords.latitude}
                onChange={(e) =>
                  setCoords({ ...coords, latitude: e.target.value })
                }
              />
              <Input
                placeholder="Longitude"
                value={coords.longitude}
                onChange={(e) =>
                  setCoords({ ...coords, longitude: e.target.value })
                }
              />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-3 gap-5">
              <Input
                placeholder="Contact Name"
                value={contact.name}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value })
                }
              />
              <Input
                placeholder="Contact Phone"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
              />
              <Input
                placeholder="Contact Email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="abhicares"
                type="submit"
                disabled={isLoading || isUpdateLoading}
              >
                {isLoading || isUpdateLoading
                  ? "Saving..."
                  : seller
                    ? "Update Partner"
                    : "Add Partner"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddSellerModal;
