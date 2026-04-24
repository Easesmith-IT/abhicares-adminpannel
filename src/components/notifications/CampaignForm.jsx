import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

/* 🔹 Shadcn */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MultiSelect from "../shared/MultiSelect";
import { useCities } from "@/components/filters/city";
import useGetApiReq from "../../hooks/useGetApiReq";
import { toast } from "sonner";

export default function CampaignForm({
  defaultValues = {},
  onSubmit,
  loading,
  isEdit = false,
}) {
  const [imagePreview, setImagePreview] = useState(
    defaultValues.image_url || "",
  );

  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
  };

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = "";
    setImageFile(null);
    setImagePreview("");
  };

  const [scheduleType, setScheduleType] = useState(
    defaultValues.scheduled_at ? "later" : "now",
  );

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
      target_type: "",
      cities: [],
      scheduled_at: "",
      ...defaultValues,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const watchAll = watch();

  const { res, fetchData, isLoading } = useGetApiReq();

  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchCities = useCallback(() => {
    fetchData(`/cities/getAllCities`);
  }, [fetchData]);

  useEffect(() => {
    fetchCities();
  }, []);

  // Handle response
  useEffect(() => {
    if (res?.status !== 200 && res?.status !== 201) return;

    const { data } = res.data;
    const modifiedCities = data?.map((city) => ({
      label: city?.name,
      value: city?._id,
    }));

    setCities(modifiedCities || []);
  }, [res]);

  // useEffect(() => {
  //   if (cities) {
  //     const modifiedCities = cities?.map((city) => ({
  //       label: city?.name,
  //       value: city?._id,
  //     }));
  //     setValue("cities", modifiedCities);
  //   }
  // }, [cities]);

  /* 🔹 Submit */
  const handleFormSubmit = (data) => {
    console.log("data", data);

    if (
      !data.title ||
      !data.body ||
      !data.target_type ||
      data.cities.length === 0 ||
      !data.scheduled_at
    ) {
      return toast.error(
        "Required fields: Title, Message, City, Schedule Date, User Type",
      );
    }

    let parsedPayload = {};

    const formData = new FormData();

    // Basic fields
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("target_type", data.target_type);
    formData.append("send_method", data.send_method);
    formData.append("schedule_type", scheduleType);

    // Cities (🔥 must stringify)
    formData.append("cities", JSON.stringify(data.cities || []));

    // Schedule
    if (scheduleType === "later") {
      formData.append("scheduled_at", `${data.scheduled_at}:00+05:30`);
    }

    // Image file (🔥 NOT preview URL)
    if (imageFile) {
      formData.append("notificationImage", imageFile);
    }

    // Call API
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 🔹 Audience */}
        <Card>
          <CardHeader>
            <CardTitle>Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type */}
            <FormField
              control={control}
              name="target_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select User Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cities */}
            <FormField
              control={control}
              name="cities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Cities</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={cities || []}
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 🔹 Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Campaign Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write message..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <Input
              ref={fileRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleImage}
            />

            {imagePreview && (
              <div className="relative w-fit mt-2">
                <img src={imagePreview} className="h-32 rounded-lg border" />

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-6 w-6"
                  onClick={removeImage}
                >
                  ✕
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🔹 Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={scheduleType}
              onValueChange={setScheduleType}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="now" />
                <Label>Send Now</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="later" />
                <Label>Schedule</Label>
              </div>
            </RadioGroup>

            {scheduleType === "later" && (
              <FormField
                control={control}
                name="scheduled_at"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* 🔹 Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{watchAll.title || "Title"}</p>
            <p className="text-muted-foreground">
              {watchAll.body || "Message"}
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Submit */}
        <div className="flex justify-end">
          <Button variant="abhicares" type="submit">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Campaign"
                : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
