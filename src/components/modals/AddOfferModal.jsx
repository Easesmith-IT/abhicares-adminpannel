import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/* ---------------- Helpers ---------------- */

const validateCouponCode = (code) => /^[A-Z]+$/.test(code);
const formatCouponCode = (input) => input.toUpperCase().replace(/\s+/g, "");

/* ---------------- Component ---------------- */

const AddOfferModal = ({ setIsModalOpen, offer = null, getAllOffers }) => {
  const { res: addOfferRes, fetchData: addOffer, isLoading } = usePostApiReq();
  const { res: updateOfferRes, fetchData: updateOffer,isLoading:isOfferLoading } = usePatchApiReq();
  const { res: getCategoriesRes, fetchData: getCategories } = useGetApiReq();

  const [description, setDescription] = useState(offer?.description ?? "");
  const [selectedItems, setSelectedItems] = useState(offer?.categoryType ?? []);
  const [allCategories, setAllCategories] = useState([]);

  const [offerInfo, setOfferInfo] = useState({
    name: offer?.name ?? "",
    offPercentage: offer?.offPercentage ?? "",
    noOfTimesPerUser: offer?.noOfTimesPerUser ?? 1,
    status: offer?.status ?? "active",
    type: offer?.discountType ?? "",
    upTo: offer?.maxDiscount ?? "",
    offerValue: offer?.couponFixedValue ?? "",
    expiryDate:
      offer?.expiryDate && format(new Date(offer.expiryDate), "yyyy-MM-dd"),
  });

  /* ---------------- Handlers ---------------- */

  const handleChange = (key, value) => {
    if (key === "name") value = formatCouponCode(value);
    setOfferInfo((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- Fetch Categories ---------------- */

  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (getCategoriesRes?.status === 200) {
      setAllCategories(getCategoriesRes.data.data ?? []);
    }
  }, [getCategoriesRes]);

  /* ---------------- Submit ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      type,
      offPercentage,
      offerValue,
      upTo,
      noOfTimesPerUser,
      expiryDate,
    } = offerInfo;

    if (
      !name ||
      !type ||
      !expiryDate ||
      !noOfTimesPerUser ||
      selectedItems.length === 0 ||
      !description ||
      (type === "percentage" && (!offPercentage || !upTo)) ||
      (type === "fixed" && !offerValue)
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!validateCouponCode(name)) {
      toast.error("Coupon code must be uppercase with no spaces");
      return;
    }

    const payload = {
      ...offerInfo,
      description,
      discountType: type,
      maxDiscount: type === "percentage" ? upTo : "",
      couponFixedValue: type === "fixed" ? offerValue : "",
      offPercentage: type === "percentage" ? offPercentage : "",
      categoryType: selectedItems,
      ...(offer && { id: offer._id }),
    };

    offer
      ? updateOffer("/admin/update-coupon", payload)
      : addOffer("/admin/create-coupon", payload);
  };

  /* ---------------- Success ---------------- */

  useEffect(() => {
    if (addOfferRes?.status === 200 || updateOfferRes?.status === 200) {
      // toast.success(`Offer ${offer ? "updated" : "added"} successfully`);
      getAllOffers();
      setIsModalOpen(false);
    }
  }, [addOfferRes, updateOfferRes]);

  /* ---------------- Render ---------------- */

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{offer ? "Update Offer" : "Add Offer"}</DialogTitle>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Code */}
          <div className="space-y-3">
            <Label>Coupon Code</Label>
            <Input
              value={offerInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-3">
              {allCategories.map((cat) => (
                <div key={cat._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(cat._id)}
                    onCheckedChange={(checked) =>
                      setSelectedItems((prev) =>
                        checked
                          ? [...prev, cat._id]
                          : prev.filter((i) => i !== cat._id),
                      )
                    }
                  />
                  <Label className="font-normal">{cat.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Type */}
          {!offer && (
            <div className="space-y-3">
              <Label>Coupon Type</Label>
              <Select
                value={offerInfo.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Percentage */}
          {offerInfo.type === "percentage" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={offerInfo.offPercentage}
                  onChange={(e) =>
                    handleChange("offPercentage", e.target.value)
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>Up To</Label>
                <Input
                  type="number"
                  value={offerInfo.upTo}
                  onChange={(e) => handleChange("upTo", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Fixed */}
          {offerInfo.type === "fixed" && (
            <div className="space-y-3">
              <Label>Offer Value</Label>
              <Input
                type="number"
                value={offerInfo.offerValue}
                onChange={(e) => handleChange("offerValue", e.target.value)}
              />
            </div>
          )}

          {/* Meta */}
          <div className="space-y-3">
            <Label>Times Per User</Label>
            <Input
              type="number"
              value={offerInfo.noOfTimesPerUser}
              onChange={(e) => handleChange("noOfTimesPerUser", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Expiry Date</Label>
            <Input
              type="date"
              value={offerInfo.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
          </div>

          {/* Status */}
          {offer && (
            <div className="space-y-3">
              <Label>Status</Label>
              <Select
                value={offerInfo.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <Label>Description</Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />
          </div>

       

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button variant="abhicares" disabled={isLoading || isOfferLoading}>
              {isLoading || isOfferLoading
                ? "Saving..."
                : offer
                  ? "Update Offer"
                  : "Add Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOfferModal;
