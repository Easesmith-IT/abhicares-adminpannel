import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";

import CityForm from "../../components/city/CityForm";
import Wrapper from "../../components/wrappers/Wrapper";
import usePutApiReq from "../../hooks/usePutApiReq";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const UpdateCityPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const {
    res: getRes,
    fetchData: fetchCity,
    isLoading: isFetching,
  } = useGetApiReq();

  const {
    res: updateRes,
    fetchData: updateCity,
    isLoading: isUpdating,
  } = usePutApiReq();

  /* -------- Fetch city by ID -------- */
  useEffect(() => {
    if (cityId) {
      fetchCity(`/cities/cities/${cityId}`, {
        screenName: "UpdateCityPage",
      });
    }
  }, [cityId]);

  /* -------- Handle update -------- */
  const handleUpdateCity = (payload) => {
    updateCity(`/cities/admin/cities/${cityId}`, payload);
  };

  useEffect(() => {
    if (updateRes?.status === 200 || updateRes?.status === 201) {
      // toast.success("City updated successfully");
      navigate("/admin/available-cities");
    }
  }, [updateRes]);

  const city = getRes?.data?.data;

  if (isFetching) {
    return (
      <Wrapper>
        <div className="space-y-6 py-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
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

  if (!city) {
    return (
      <Wrapper>
        <div className="py-12 text-center text-slate-500 font-medium">
          City not found
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <CityForm
        title="Update City"
        initialData={city}
        onSubmit={handleUpdateCity}
        isLoading={isUpdating}
      />
    </Wrapper>
  );
};

export default UpdateCityPage;
