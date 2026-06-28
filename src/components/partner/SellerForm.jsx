import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useGetApiReq from "@/hooks/useGetApiReq";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { FormMessage } from "../ui/form";
import { previewDbImage } from "../../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerSchema } from "../../schemas/seller.schema";
import { toast } from "sonner";

const PROFILE_MAX = 2 * 1024 * 1024;
const DOC_MAX = 5 * 1024 * 1024;

const MAX_OTHER_DOCS = 5;
const MAX_OTHER_TOTAL = 20 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const DOC_TYPES = ["image/jpeg", "image/png"];

/* ---------------- SECTION ---------------- */
const Section = ({ title, children }) => (
  <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
    <CardContent className="p-6 md:p-8 space-y-6">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">{title}</h3>
      {children}
    </CardContent>
  </Card>
);

/* ---------------- FORM ---------------- */
const SellerForm = ({ onSubmit, isEdit = false, isLoading, initialData }) => {
  const { res: catRes, fetchData: getCategories } = useGetApiReq();
  const { res: serviceRes, fetchData: getServices } = useGetApiReq();

  const [categories, setCategories] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  
  const [cities, setCities] = useState([]);
  const refs = {
    profilePhoto: useRef(null),
    aadhaarFront: useRef(null),
    documentFront: useRef(null),
    aadhaarBack: useRef(null),
    panCard: useRef(null),
    policeVerificationCertificate: useRef(null),
    shopLicense: useRef(null),
  };

  const {
    res: cityRes,
    isLoading: cityLoading,
    fetchData: getCities,
  } = useGetApiReq();

  useEffect(() => {
    getCities("/cities/getAllCities", {
      screenName: "AnnouncementForm",
    });
  }, []);

  /**
   * 🔥 Set cities when API responds
   */
  useEffect(() => {
    if (cityRes?.status === 200 || cityRes?.status === 201) {

      setCities(cityRes.data.data);
    }
  }, [cityRes]);

  const form = useForm({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      Gender: "",

      addressLine: "",
      landmark: "",
      state: "",
      pincode: "",
      cityId: "",
      cityName: "",

      categoryId: "",
      services: [],

      legalName: "",
      // gstNumber: "",
      contactPerson: {
        name: "",
        phone: "",
        email: "",
      },

      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
      },

      profilePhoto: null,
      aadhaarFront: null,
      documentFront: null,
      aadhaarBack: null,
      panCard: null,
      policeVerificationCertificate: null,
      shopLicense: null,
      otherDocuments: [],

      profilePhotoPreview: "",
      aadhaarFrontPreview: "",
      documentFrontPreview: "",
      aadhaarBackPreview: "",
      panCardPreview: "",
      policeVerificationCertificatePreview: "",
      shopLicensePreview: "",
      otherDocumentsPreview: [],
    },
  });

  

  useEffect(() => {
    if (initialData && isEdit) {
      form.reset({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        Gender: initialData.Gender,

        addressLine: initialData.address?.addressLine,
        landmark: initialData.address?.landmark,
        state: initialData.address?.state,
        pincode: initialData.address?.pincode,

        cityId: initialData.city?.cityId?._id,

        categoryId: initialData.categoryId?._id,

        // services: initialData.services?.map((s) => s.serviceId?._id) || [],

        services:
          initialData.services
            ?.map((s) => s?.serviceId?._id || s?.serviceId || null)
            .filter(Boolean) || [],
        legalName: initialData.legalName,
        // gstNumber: initialData.gstNumber,

        contactPerson: {
          name: initialData.contactPerson?.name,
          phone: initialData.contactPerson?.phone,
          email: initialData.contactPerson?.email,
        },

        profilePhotoPreview: initialData?.profilePhoto?.url,
        aadhaarFrontPreview: initialData?.documents?.aadhaarFront?.url,
        documentFrontPreview: initialData?.documents?.documentFront?.url,
        aadhaarBackPreview: initialData?.documents?.aadhaarBack?.url,
        panCardPreview: initialData?.documents?.panCard?.url,
        policeVerificationCertificatePreview: initialData?.documents?.policeVerificationCertificate?.url,
        shopLicensePreview: initialData?.documents?.shopLicense?.url,

        otherDocumentsPreview: initialData?.documents?.otherDocuments.map(
          (doc) => ({ preview: previewDbImage(doc.url) }),
        ),

        bankDetails: initialData.bankDetails || {},
      });
    }
  }, [initialData]);

  const Preview = ({ field, form, removeSingle }) => {
    const preview = form.watch(`${field}Preview`);
    const file = form.watch(field);

    return (
      <div className="relative mt-2 w-fit">
        <img
          src={
            file ? preview : `${import.meta.env.VITE_APP_IMAGE_URL}/${preview}`
          }
          className="h-[180px] w-[340px] rounded border object-cover"
        />

        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6"
          onClick={() => removeSingle(field)}
        >
          ✕
        </Button>
      </div>
    );
  };

  const handleSingleFile = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isProfile = field === "profilePhoto";

    if (!(isProfile ? IMAGE_TYPES : DOC_TYPES).includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    if (file.size > (isProfile ? PROFILE_MAX : DOC_MAX)) {
      toast.error(isProfile ? "Profile photo max 2MB" : "Document max 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);

    form.setValue(field, file);
    form.setValue(`${field}Preview`, preview);
  };

  const removeSingle = (field) => {
    if (refs[field]?.current) refs[field].current.value = "";

    form.setValue(field, null);
    form.setValue(`${field}Preview`, "");
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > MAX_OTHER_DOCS) {
      toast.error("Maximum 5 documents allowed");
      return;
    }

    for (const file of files) {
      if (!DOC_TYPES.includes(file.type)) {
        toast.error(`${file.name} invalid type`);
        return;
      }

      if (file.size > DOC_MAX) {
        toast.error(`${file.name} exceeds 5MB`);
        return;
      }
    }

    const total = files.reduce((sum, f) => sum + f.size, 0);

    if (total > MAX_OTHER_TOTAL) {
      toast.error("Total files exceed 20MB");
      return;
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    form.setValue("otherDocuments", files);
    form.setValue("otherDocumentsPreview", previews);
  };

  const removeMultiple = (index) => {
    const files = form.getValues("otherDocuments") || [];
    const previews = form.getValues("otherDocumentsPreview") || [];

    files.splice(index, 1);
    previews.splice(index, 1);

    form.setValue("otherDocuments", [...files]);
    form.setValue("otherDocumentsPreview", [...previews]);
  };

   const cityId = form.watch("cityId");
  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    cityId && getCategories(`/categories/app/get-categories?cityId=${cityId}`);
  }, [cityId]);

  useEffect(() => {
    if (catRes?.status === 200) {
      setCategories(catRes.data.categories);
      
    }
  }, [catRes]);
  
  const categoryId = form.watch("categoryId");
  
  useEffect(() => {
    if (categoryId && cityId) {
      // getServices(`/admin/get-category-service/${categoryId}`);
      getServices(`/services/get-services/${categoryId}?cityId=${cityId}`);
    }
  }, [categoryId,cityId]);
  
  useEffect(() => {
    if (serviceRes?.status === 200) {
      setServicesList(serviceRes.data.data);
    }
  }, [serviceRes]);

  /* ---------------- FILE HANDLING ---------------- */
  const handleFile = (field, e) => {
    const file = e.target.files?.[0];
    if (file) form.setValue(field, file);
  };

  const handleMultiFile = (e) => {
    const files = Array.from(e.target.files || []);
    form.setValue("otherDocuments", files);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (values) => {
    const formData = new FormData();

    /* -------- BASIC -------- */
    [
      "name",
      "phone",
      "email",
      "Gender",
      "addressLine",
      "landmark",
      "state",
      "pincode",
      "cityId",
      "categoryId",
      "subCategoryId",
      "legalName",
      // "gstNumber",
    ].forEach((key) => {
      if (values[key]) formData.append(key, values[key]);
    });

    /* -------- CONTACT PERSON -------- */
    formData.append("contactPerson[name]", values.contactPerson?.name || "");
    formData.append("contactPerson[phone]", values.contactPerson?.phone || "");
    formData.append("contactPerson[email]", values.contactPerson?.email || "");

    /* -------- SERVICES -------- */
    values.services?.forEach((s) => {
      formData.append("services", s);
    });

    /* -------- BANK -------- */
    Object.keys(values.bankDetails || {}).forEach((key) => {
      if (values.bankDetails[key]) {
        formData.append(`bankDetails[${key}]`, values.bankDetails[key]);
      }
    });

    /* -------- FILES -------- */
    [
      "profilePhoto",
      "aadhaarFront",
      "documentFront",
      "aadhaarBack",
      "panCard",
      "policeVerificationCertificate",
      "shopLicense",
    ].forEach((field) => {
      if (values[field]) {
        formData.append(field, values[field]);
      }
    });

    values.otherDocuments?.forEach((file) => {
      formData.append("otherDocuments", file);
    });


    onSubmit(formData);
  };

  const handleError = (error)=> {
    
  }

  /* ---------------- UI ---------------- */
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        className="space-y-6"
      >
        {/* BASIC */}
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="Gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {/* BUSINESS */}
        <Section title="Business Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="cityId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    key={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

           {form.watch("cityId") && <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    key={field.value}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("services", []);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id ||c.id} value={c._id||c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />}

            {form.watch("categoryId") && (
              <FormField
                name="services"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Services</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {servicesList.map((s) => (
                        <label key={s._id} className="flex gap-2">
                          <input
                            type="checkbox"
                            checked={field.value.includes(s._id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                field.onChange([...field.value, s._id]);
                              else
                                field.onChange(
                                  field.value.filter((id) => id !== s._id),
                                );
                            }}
                          />
                          {s.name}
                        </label>
                      ))}
                      {servicesList?.length === 0 && <p className="text-sm text-muted-foreground">No Services for selected category</p>}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="legalName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="gstNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              name="contactPerson.name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contactPerson.email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contactPerson.phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Phone</FormLabel>
                  <Input type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {/* ADDRESS */}
        <Section title="Address">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="addressLine"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="landmark"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="state"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="pincode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
        </Section>

        {/* BANK */}
        <Section title="Bank Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="bankDetails.accountNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bankDetails.ifscCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bankDetails.accountHolderName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bankDetails.bankName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {/* DOCUMENTS */}
        <Section title="Documents">
          <div className="grid grid-cols-3 gap-5">

          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <p className="text-sm text-muted-foreground">
              Max 2MB • JPG PNG WEBP
            </p>
            <Input
              ref={refs.profilePhoto}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => handleSingleFile("profilePhoto", e)}
            />

            {form.watch("profilePhotoPreview") && (
              <Preview
                field="profilePhoto"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Aadhaar Front</FormLabel>
            <p className="text-sm text-muted-foreground">
              Max 2MB • JPG PNG WEBP
            </p>
            <Input
              ref={refs.aadhaarFront}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => handleSingleFile("aadhaarFront", e)}
            />

            {form.watch("aadhaarFrontPreview") && (
              <Preview
                field="aadhaarFront"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Aadhaar Back</FormLabel>
            <p className="text-sm text-muted-foreground">
              Max 2MB • JPG PNG WEBP
            </p>
            <Input
              ref={refs.aadhaarBack}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => handleSingleFile("aadhaarBack", e)}
            />

            {form.watch("aadhaarBackPreview") && (
              <Preview
                field="aadhaarBack"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>
          
          <FormItem>
            <FormLabel>Document Front</FormLabel>
            <p className="text-sm text-muted-foreground">
              Max 2MB • JPG PNG WEBP
            </p>
            <Input
              ref={refs.documentFront}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => handleSingleFile("documentFront", e)}
            />

            {form.watch("documentFrontPreview") && (
              <Preview
                field="documentFront"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          {/* PAN CARD */}
          <FormItem>
            <FormLabel>PAN Card</FormLabel>
            <p className="text-sm text-muted-foreground">
              PDF/JPG/PNG • Max 5MB
            </p>
            <Input
              ref={refs.panCard}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleSingleFile("panCard", e)}
            />

            {form.watch("panCardPreview") && (
              <Preview
                field="panCard"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Police Verification Certificate</FormLabel>
            <p className="text-sm text-muted-foreground">
              PDF/JPG/PNG • Max 5MB
            </p>
            <Input
              ref={refs.policeVerificationCertificate}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleSingleFile("policeVerificationCertificate", e)}
            />

            {form.watch("policeVerificationCertificatePreview") && (
              <Preview
                field="policeVerificationCertificate"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          {/* SHOP LICENSE */}
          <FormItem>
            <FormLabel>Shop License</FormLabel>
            <p className="text-sm text-muted-foreground">
              PDF/JPG/PNG • Max 5MB
            </p>
            <Input
              ref={refs.shopLicense}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleSingleFile("shopLicense", e)}
            />

            {form.watch("shopLicensePreview") && (
              <Preview
                field="shopLicense"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          {/* MULTIPLE */}
          <FormItem>
            <FormLabel>Other Documents</FormLabel>
            <p className="text-sm text-muted-foreground">
              Max 5 files • 5MB each • 20MB total
            </p>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleMultipleFiles}
            />

            <div className="flex gap-2 mt-2 flex-wrap">
              {form.watch("otherDocumentsPreview")?.map((doc, i) => (
                <div key={i} className="relative">
                  <img
                    src={doc.preview}
                    className="h-[80px] w-[80px] rounded border"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeMultiple(i)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </FormItem>
          </div>

        </Section>

        <div className="flex justify-end">
          <Button variant="abhicares" type="submit">
            {isLoading ? (
              <Spinner />
            ) : isEdit ? (
              "Update Seller"
            ) : (
              "Create Seller"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SellerForm;
