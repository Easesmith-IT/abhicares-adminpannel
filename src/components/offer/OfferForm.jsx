import { useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema } from "@/schemas/offer.schema";

import useGetApiReq from "@/hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Spinner } from "../ui/spinner";
import { fetchLookup } from "../../utils/fetchLookup";
import AsyncEntitySelect from "../shared/AsyncEntitySelect";
import DatePicker from "../shared/DatePicker";

const defaultValues = {
  name: "",
  code: "",
  type: "",
  description: "",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderValue: 0,
  validFrom: "",
  validTo: "",
  isActive: true,
  priority: 0,

  applicableTo: {
    services: [],
    products: [],
    packages: [],
  },

  applicableCities: [],
  applicableUserTypes: ["ALL"],

  flat: { currency: "INR" },
  combo: { buyQuantity: 1, getQuantity: 1, discountOn: "GET_ITEMS" },
};

const OfferForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  onCancel,
}) => {
  const form = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: initialValues || defaultValues,
  });

  const type = useWatch({ control: form.control, name: "type" });

  const onError = (error)=>{
    console.log("error",error);
    
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        {/* BASIC */}
        <div className="grid grid-cols-2 gap-5">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* TYPE */}
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FLAT">Flat</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="COMBO">Combo</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* FLAT */}
          {type === "FLAT" && (
            <>
              <FormField
                name="discountValue"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Discount Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="flat.currency"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* PERCENTAGE */}
          {type === "PERCENTAGE" && (
            <>
              <FormField
                name="discountValue"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="maxDiscountAmount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Discount Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* COMBO */}
          {type === "COMBO" && (
            <div className="grid grid-cols-3 gap-4">
              <FormField
                name="combo.buyQuantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Qty</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="combo.getQuantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Get Qty</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="combo.discountOn"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount On</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET_ITEMS">Get Items</SelectItem>
                        <SelectItem value="ALL_ITEMS">All Items</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormField
            name="applicableTo.services"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable Services</FormLabel>
                <AsyncEntitySelect
                  value={field.value}
                  fetchFn={(search, page, limit) =>
                    fetchLookup("services", search, page, limit)
                  }
                  onChange={field.onChange}
                  placeholder="Search services..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="applicableTo.products"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable Products</FormLabel>
                <AsyncEntitySelect
                  value={field.value}
                  fetchFn={(search, page, limit) =>
                    fetchLookup("products", search, page, limit)
                  }
                  onChange={field.onChange}
                  placeholder="Search products..."
                />
              </FormItem>
            )}
          />

          <FormField
            name="applicableTo.packages"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable Packages</FormLabel>
                <AsyncEntitySelect
                  value={field.value}
                  fetchFn={(search, page, limit) =>
                    fetchLookup("packages", search, page, limit)
                  }
                  onChange={field.onChange}
                  placeholder="Search packages..."
                />
              </FormItem>
            )}
          />

          <FormField
            name="applicableCities"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable Cities</FormLabel>
                <AsyncEntitySelect
                  value={field.value.map((c) => c.cityId)}
                  fetchFn={(search, page, limit) =>
                    fetchLookup("cities", search, page, limit)
                  }
                  placeholder="Search cities..."
                  onChange={(ids) =>
                    field.onChange(
                      ids.map((id) => ({
                        cityId: id,
                        isActive: true,
                      })),
                    )
                  }
                />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* VALID FROM */}
          <FormField
            name="validFrom"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VALID TO */}
          <FormField
            name="validTo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid To</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select end date"
                    disabled={(date) =>
                      form.getValues("validFrom")
                        ? date < form.getValues("validFrom")
                        : false
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* USER TYPES */}
        <FormField
          name="applicableUserTypes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Types</FormLabel>
              <div className="flex gap-4">
                {["NEW", "RETURNING", "ALL"].map((type) => (
                  <label key={type} className="flex gap-2 items-center">
                    <Checkbox
                      checked={field.value.includes(type)}
                      onCheckedChange={(c) =>
                        c
                          ? field.onChange([...field.value, type])
                          : field.onChange(
                              field.value.filter((v) => v !== type),
                            )
                      }
                    />
                    {type}
                  </label>
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* META */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            name="minOrderValue"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Order Value</FormLabel>
                <Input type="number" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="priority"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Input type="number" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active</FormLabel>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormItem>
            )}
          />
        </div>

        {/* DESCRIPTION */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <ReactQuill value={field.value || ""} onChange={field.onChange} />
            </FormItem>
          )}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-14">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="abhicares" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OfferForm;
