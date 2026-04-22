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

/* ---------------- SECTION ---------------- */
const Section = ({ title, children }) => (
  <Card>
    <CardContent className="pt-6 space-y-5">
      <h3 className="text-lg font-semibold">{title}</h3>
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
    panCard: useRef(null),
    addressProof: useRef(null),
    gstCertificate: useRef(null),
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
      console.log("cityRes", cityRes);

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
      gstNumber: "",
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
      panCard: null,
      addressProof: null,
      gstCertificate: null,
      shopLicense: null,
      otherDocuments: [],

      profilePhotoPreview: "",
      panCardPreview: "",
      addressProofPreview: "",
      gstCertificatePreview: "",
      shopLicensePreview: "",
      otherDocumentsPreview: [],

      addressProofType: "AADHAAR",
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

        services: initialData.services?.map((s) => s.serviceId?._id) || [],

        legalName: initialData.legalName,
        gstNumber: initialData.gstNumber,

        contactPerson: {
          name: initialData.contactPerson?.name,
          phone: initialData.contactPerson?.phone,
          email: initialData.contactPerson?.email,
        },

        profilePhotoPreview: initialData?.profilePhoto?.url,
        panCardPreview: initialData?.documents?.panCard?.url,
        addressProofPreview: initialData?.documents?.profilePhoto?.url,
        gstCertificatePreview: initialData?.documents?.gstCertificate?.url,
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
          className="h-[120px] w-[120px] rounded border object-cover"
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

  const handleSingleFile = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (catRes?.status === 200) {
      setCategories(catRes.data.data);
    }
  }, [catRes]);

  const categoryId = form.watch("categoryId");

  useEffect(() => {
    if (categoryId) {
      getServices(`/admin/get-category-service/${categoryId}`);
    }
  }, [categoryId]);

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
    console.log("values", values);

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
      "gstNumber",
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
      "panCard",
      "addressProof",
      "gstCertificate",
      "shopLicense",
    ].forEach((field) => {
      if (values[field]) {
        formData.append(field, values[field]);
      }
    });

    values.otherDocuments?.forEach((file) => {
      formData.append("otherDocuments", file);
    });

    formData.append("addressProofType", values.addressProofType);

    onSubmit(formData);
  };

  /* ---------------- UI ---------------- */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Input {...field} />
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

            <FormField
              name="gstNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

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
          {/* PROFILE PHOTO */}
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
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

          {/* PAN CARD */}
          <FormItem>
            <FormLabel>PAN Card</FormLabel>
            <Input
              ref={refs.panCard}
              type="file"
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

          {/* ADDRESS PROOF */}
          <FormItem>
            <FormLabel>Address Proof</FormLabel>
            <Input
              ref={refs.addressProof}
              type="file"
              onChange={(e) => handleSingleFile("addressProof", e)}
            />

            {form.watch("addressProofPreview") && (
              <Preview
                field="addressProof"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          {/* ADDRESS PROOF TYPE */}
          <FormField
            control={form.control}
            name="addressProofType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Proof Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AADHAAR">Aadhaar</SelectItem>
                    <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                    <SelectItem value="DRIVING_LICENSE">
                      Driving License
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* GST */}
          <FormItem>
            <FormLabel>GST Certificate</FormLabel>
            <Input
              ref={refs.gstCertificate}
              type="file"
              onChange={(e) => handleSingleFile("gstCertificate", e)}
            />

            {form.watch("gstCertificatePreview") && (
              <Preview
                field="gstCertificate"
                form={form}
                removeSingle={removeSingle}
              />
            )}
          </FormItem>

          {/* SHOP LICENSE */}
          <FormItem>
            <FormLabel>Shop License</FormLabel>
            <Input
              ref={refs.shopLicense}
              type="file"
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
            <Input type="file" multiple onChange={handleMultipleFiles} />

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
