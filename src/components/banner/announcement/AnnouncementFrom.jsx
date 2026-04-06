import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import usePostApiReq from "../../../hooks/usePostApiReq";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { useLocation, useNavigate } from "react-router-dom";
import Wrapper from "../../wrappers/Wrapper";
import { BackLink } from "../../shared/back-link";
import { H2 } from "../../shared/typography";


const AnnouncementForm = ({  label = "Save" }) => {
  const { res,fetchData: postData, isLoading } = usePostApiReq();
  const navigate = useNavigate();

  const {
    res: cityRes,
    isLoading: cityLoading,
    fetchData: getCities,
  } = useGetApiReq();

  const [cities, setCities] = useState([]);
  const location = useLocation();

  const editData = location.state?.data || "";
  console.log("editData", editData);
  

  const form = useForm({
  defaultValues: {
    cityId: "",
    title: "",
    ctaText: "Book Now",
    ctaLink: "",
    bgColor: "#1D4ED8",
    textColor: "#FFFFFF",
  },
});

const { setValue, watch, reset } = form;

useEffect(() => {
  if (editData && Object.keys(editData).length > 0) {
    reset({
      cityId: editData.cityId?._id || editData.cityId,
      title: editData.title,
      ctaText: editData.ctaText,
      ctaLink: editData.ctaLink,
      bgColor: editData.bgColor,
      textColor: editData.textColor,
      _id: editData._id, // 🔥 VERY IMPORTANT for update API
    });
  }
}, [editData,cities]);

  const bgColor = watch("bgColor");
  const textColor = watch("textColor");

  /**
   * 🔥 Fetch cities using hook
   */
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
        console.log("cityRes",cityRes);
        
      setCities(cityRes.data.data);
    }
  }, [cityRes]);
  
  const onSubmit = (data) => {
      postData("/banners/update-announcement", data, {
          screenName: "AnnouncementForm",
        });
    };

    useEffect(() => {
      if (res?.status === 200 || res?.status === 201) {
          console.log("res",res);
          navigate("/admin/banners")
      }
    }, [res]);

  const onError = (err) => {
    console.log("form error", err);
  };


  return (
    <Wrapper>
      <div className="space-y-6">
        <BackLink href={-1}>
          <H2>{editData? "Update" : "Add"} Announcement</H2>
        </BackLink>
        <Card>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-6"
              >
                {/* City */}
                <FormItem>
                  <Label>City</Label>
                  <Select
                    value={watch("cityId")}
                    onValueChange={(val) => setValue("cityId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          cityLoading ? "Loading cities..." : "Select city"
                        }
                      />
                    </SelectTrigger>
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

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Title</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <Label>CTA Text</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <Label>CTA Link</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="gap-6 hidden">
                  <FormField
                    control={form.control}
                    name="bgColor"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Background</Label>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Text</Label>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button variant="abhicares" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : label}
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

export default AnnouncementForm;
