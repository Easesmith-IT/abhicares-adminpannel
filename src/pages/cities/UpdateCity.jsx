import toast from "react-hot-toast";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import CityForm from "../../components/city/CityForm";
import Wrapper from "../../components/wrappers/Wrapper";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateCityPage = () => {
  const { res, fetchData, isLoading } = usePatchApiReq();
  const { state: city } = useLocation();
   const navigate = useNavigate();

  const handleUpdateCity = (payload) => {
    fetchData(`/admin/update-availabe-city/${city._id}`, payload);
  };

  if (res?.status === 200 || res?.status === 201) {
    toast.success("City updated successfully");
    navigate("/admin/available-cities");
  }

  return (
    <Wrapper>
      <CityForm
        title="Update City"
        initialData={city}
        onSubmit={handleUpdateCity}
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default UpdateCityPage;
