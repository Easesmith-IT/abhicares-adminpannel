import toast from "react-hot-toast";
import usePostApiReq from "../../hooks/usePostApiReq";
import CityForm from "../../components/city/CityForm";
import Wrapper from "../../components/wrappers/Wrapper";
import { useNavigate } from "react-router-dom";

const AddCityPage = () => {
  const { res, fetchData, isLoading } = usePostApiReq();
  const navigate = useNavigate();

  const handleAddCity = (payload) => {
    fetchData("/admin/create-availabe-city", payload);
  };

  if (res?.status === 200 || res?.status === 201) {
    toast.success("City added successfully");
    navigate("/admin/available-cities");
  }

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
