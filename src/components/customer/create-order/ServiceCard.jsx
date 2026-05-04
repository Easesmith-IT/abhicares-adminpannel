import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const ServiceCard = ({ service }) => {
  const { name, imageUrl, startingPrice, _id } = service;
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();
  console.log("state", state);

  const handleNavigate = () => {
    navigate(
      `/admin/customers/${params?.customerId}/create-order/userAddresses/categories/${params?.categoryId}/services/${_id}/products`, {state}
    );
  };

  return (
    <Card
      onClick={handleNavigate}
      className="overflow-hidden pt-0 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-40 bg-gray-100">
        <img
          src={imageUrl ? `${import.meta.env.VITE_APP_IMAGE_URL}/${imageUrl}`:null}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold cursor-pointer hover:underline hover:text-blue-700 line-clamp-1">
          {name}
        </h3>

        <p className="text-xs text-muted-foreground mt-1">Starts from</p>

        <p className="text-base font-semibold text-primary">₹{startingPrice}</p>
      </CardContent>
    </Card>
  );
};
