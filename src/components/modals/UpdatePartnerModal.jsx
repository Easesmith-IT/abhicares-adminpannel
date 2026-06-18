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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePatchApiReq from "../../hooks/usePatchApiReq";

const UpdatePartnerModal = ({ seller, onClose, onSuccess }) => {
  const { res, fetchData, isLoading } = usePatchApiReq();

  const [formData, setFormData] = useState({
    name: seller?.name || "",
    phone: seller?.phone || "",
    email: seller?.email || "",
    Gender: seller?.Gender || seller?.gender || "MALE",
    legalName: seller?.legalName || "",
    gstNumber: seller?.gstNumber || "",
    referralSource: seller?.referralSource || "",
    addressLine: seller?.address?.addressLine || "",
    landmark: seller?.address?.landmark || "",
    pincode: seller?.address?.pincode || "",
    bankDetails: {
      accountNumber: seller?.bankDetails?.accountNumber || "",
      ifscCode: seller?.bankDetails?.ifscCode || "",
      accountHolderName: seller?.bankDetails?.accountHolderName || "",
      bankName: seller?.bankDetails?.bankName || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Name, Phone, and Email are required fields");
      return;
    }
    fetchData(`/sellers/update-seller/${seller._id}`, formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      toast.success("Partner details updated successfully");
      if (onSuccess) onSuccess();
    }
  }, [res, onSuccess]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl bg-white shadow-xl border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Edit Partner Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-3 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 py-2">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Partner Full Name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@domain.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select
                    value={formData.Gender}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, Gender: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Business & Compliance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="legalName">Company / Legal Name</Label>
                  <Input id="legalName" name="legalName" value={formData.legalName} onChange={handleChange} placeholder="Legal registration name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gstNumber">GSTIN (GST Number)</Label>
                  <Input id="gstNumber" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST identification code" className="font-mono uppercase" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="referralSource">Referral Source</Label>
                  <Input id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange} placeholder="e.g. Word of mouth, Google ad, friend" />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Address Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="addressLine">Street Address</Label>
                  <Input id="addressLine" name="addressLine" value={formData.addressLine} onChange={handleChange} placeholder="Address detail coordinates" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Major reference point" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" name="pincode" type="number" value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Settlement Bank Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" name="accountNumber" value={formData.bankDetails.accountNumber} onChange={handleBankChange} placeholder="Bank account number" className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input id="ifscCode" name="ifscCode" value={formData.bankDetails.ifscCode} onChange={handleBankChange} placeholder="IFSC identifier" className="font-mono uppercase" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input id="accountHolderName" name="accountHolderName" value={formData.bankDetails.accountHolderName} onChange={handleBankChange} placeholder="Settlement account name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" name="bankName" value={formData.bankDetails.bankName} onChange={handleBankChange} placeholder="e.g. State Bank of India" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button type="submit" variant="abhicares" disabled={isLoading} className="rounded-xl font-semibold px-6">
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePartnerModal;
