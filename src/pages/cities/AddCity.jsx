import { useEffect } from "react";
import usePostApiReq from "../../hooks/usePostApiReq";
import CityForm from "../../components/city/CityForm";
import Wrapper from "../../components/wrappers/Wrapper";
import { useNavigate } from "react-router-dom";

const AddCityPage = () => {
  const { res, fetchData, isLoading } = usePostApiReq();
  const navigate = useNavigate();

  const handleAddCity = (payload) => {
    fetchData("/cities/admin/cities", payload);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      navigate("/admin/available-cities");
    }
  }, [res, navigate]);

  return (
    <Wrapper>
      <CityForm
        title="Add City"
        onSubmit={handleAddCity}
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default AddCityPage;
