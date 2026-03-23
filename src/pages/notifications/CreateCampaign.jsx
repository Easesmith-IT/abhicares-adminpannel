import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


/* 🔹 Shadcn UI */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CampaignForm from "../../components/notifications/CampaignForm";
import { toast } from "sonner";
import Wrapper from "../../components/wrappers/Wrapper";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    setLoading(true);

    try {
      await axios.post("/api/notifications", data);

      toast.success("Campaign created successfully");

      navigate("/admin/notifications");
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* 🔹 Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-2xl font-semibold">Create Campaign</h1>
        </div>

        {/* 🔹 Form Wrapper */}
        <Card>
          <CardHeader>
            <CardTitle>New Notification Campaign</CardTitle>
          </CardHeader>

          <CardContent>
            <CampaignForm onSubmit={handleCreate} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
