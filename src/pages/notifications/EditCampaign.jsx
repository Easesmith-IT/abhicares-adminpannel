import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* 🔹 Shadcn UI */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import CampaignForm from "../../components/notifications/CampaignForm";
import { toast } from "sonner";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";
import { axiosInstance } from "../../utils/axiosInstance";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await axiosInstance.get(`/notifications/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load campaign");

      navigate("/admin/notifications");
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/notifications/${id}`, formData);
      toast.success("Campaign updated successfully");
      navigate("/admin/notifications");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update campaign");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Loading State */
  if (pageLoading) {
    return (
      <Wrapper>
        <div className="space-y-6 max-w-3xl mx-auto py-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Form Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    );
  }

  /* 🔹 Not Found State */
  if (!data) {
    return (
      <Wrapper>
        <div className="space-y-6 max-w-3xl mx-auto py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <H2 className="text-2xl font-semibold">Edit Campaign</H2>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 font-medium">Campaign not found</p>
              <Button onClick={() => navigate(-1)} className="mt-4" variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* 🔹 Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <H2 className="text-2xl font-semibold">Edit Campaign</H2>
        </div>

        {/* 🔹 Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Notification Campaign</CardTitle>
          </CardHeader>

          <CardContent>
            <CampaignForm
              defaultValues={data}
              onSubmit={handleUpdate}
              loading={loading}
              isEdit
            />
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
