import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

/* 🔹 Shadcn UI */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CampaignForm from "../../components/notifications/CampaignForm";
import { toast } from "sonner";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";

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
      const res = await axios.get(`/api/notifications/${id}`);
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
    setLoading(true);

    await axios.put(`/api/notifications/${id}`, formData);

    toast.success("Campaign updated successfully");

    navigate("/admin/notifications");
  };

  /* 🔹 Loading State */
  if (pageLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-muted-foreground">Loading campaign...</p>
      </div>
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
