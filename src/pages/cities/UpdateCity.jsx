import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePatchApiReq from "../../hooks/usePatchApiReq";

import CityForm from "../../components/city/CityForm";
import Wrapper from "../../components/wrappers/Wrapper";
import usePutApiReq from "../../hooks/usePutApiReq";

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
        <p>Loading city details...</p>
      </Wrapper>
    );
  }

  if (!city) return null;

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
