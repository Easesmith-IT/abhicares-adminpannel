import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


/* 🔹 Shadcn UI */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import CampaignForm from "../../components/notifications/CampaignForm";
import Wrapper from "../../components/wrappers/Wrapper";
import usePostApiReq from "../../hooks/usePostApiReq";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const { fetchData, res, isLoading } = usePostApiReq();

  const handleCreate = async (data) => {
    fetchData("/notifications/send",data)
  };

  useEffect(() => {
     if (res?.status === 201 || res?.status === 200) {
       navigate("/admin/notifications");
     }
  
  }, [res])
  

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
            <CampaignForm onSubmit={handleCreate} loading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
