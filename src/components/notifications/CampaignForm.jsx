import { useEffect, useState } from "react";
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

export default function CampaignForm({
  defaultValues = {},
  onSubmit,
  loading,
  isEdit = false,
}) {
   const { cities } = useCities();
    

  const [imagePreview, setImagePreview] = useState(
    defaultValues.image_url || "",
  );

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
      data_payload: "",
      ...defaultValues,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const watchAll = watch();

  console.log("cities", cities);
  
  useEffect(() => {
    if (cities) {
      const modifiedCities = cities?.map((city) => ({
        label: city?.name,
        value: city?._id,
      }));
      setValue("cities", modifiedCities);
    }
  }, [cities]);

  /* 🔹 Image Upload */
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload", formData);
      setImagePreview(res.data.url);
    } catch (err) {
      console.error(err);
    }
  };

  /* 🔹 Submit */
  const handleFormSubmit = (data) => {
    let parsedPayload = {};

    try {
      parsedPayload = data.data_payload ? JSON.parse(data.data_payload) : {};
    } catch {
      alert("Invalid JSON in Data Payload");
      return;
    }

    onSubmit({
      ...data,
      image_url: imagePreview,
      scheduled_at: scheduleType === "later" ? data.scheduled_at : null,
      cities: data.cities || [],
      data_payload: parsedPayload,
    });
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
                      options={watch("cities") || []}
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
            <div>
              <Label>Upload Image</Label>
              <Input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-2 h-32 rounded-lg border"
                />
              )}
            </div>
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

        {/* 🔹 Data Payload */}
        <Card>
          <CardHeader>
            <CardTitle>Data Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="data_payload"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='{"screen":"offers"}' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
        <Button type="submit" className="w-full">
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Campaign"
              : "Create Campaign"}
        </Button>
      </form>
    </Form>
  );
}
