import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema } from "@/schemas/offer.schema";

import usePostApiReq from "@/hooks/usePostApiReq";
import usePatchApiReq from "@/hooks/usePatchApiReq";
import useGetApiReq from "@/hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import { Card, CardContent } from "../../components/ui/card";

const CreateOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchData: createOffer, isLoading } = usePostApiReq();
  const { fetchData: updateOffer, isLoading: updating } = usePatchApiReq();
  const { fetchData: getOffer, res: offerRes } = useGetApiReq();

  const form = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "",
      discountValue: "",
      maxDiscountAmount: "",
      minOrderValue: 0,
      validFrom: "",
      validTo: "",
      description: "",
      applicableTo: { services: [], products: [], packages: [] },
      applicableCities: [],
      applicableUserTypes: ["ALL"],
      priority: 0,
      isActive: true,
    },
  });

  const type = form.watch("type");

  /* ---------- Edit Mode ---------- */
  useEffect(() => {
    if (id) getOffer(`/api/offers/${id}`);
  }, [id]);

  useEffect(() => {
    if (offerRes?.status === 200) {
      form.reset(offerRes.data.data);
    }
  }, [offerRes]);

  /* ---------- Submit ---------- */
  const onSubmit = async (data) => {
    const res = id
      ? await updateOffer(`/api/offers/${id}`, data)
      : await createOffer("/api/offers/create-offer", data);

    if (res?.status === 200 || res?.status === 201) {
      toast.success(`Offer ${id ? "updated" : "created"} successfully`);
      navigate("/admin/offers");
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>{id ? "Update Offer" : "Create Offer"}</H2>
        </BackLink>
        <Card>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
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

                {/* Code */}
                <FormField
                  control={form.control}
                  name="code"
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

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount */}
                {type !== "PERCENTAGE" && (
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {type === "PERCENTAGE" && (
                  <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Discount Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid From</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid To</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading || updating}>
                    {isLoading || updating ? "Saving..." : "Save Offer"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
};

export default CreateOffer;
