import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import { setSelectedService } from "../../../store/slices/createOrderDraftSlice";

export const ServiceCard = ({ service }) => {
  const { name, imageUrl, startingPrice, _id } = service;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const handleNavigate = () => {
    dispatch(
      setSelectedService({
        id: _id,
        name,
      }),
    );

    navigate(
      `/admin/customers/${params?.customerId}/create-order/userAddresses/categories/${params?.categoryId}/services/${_id}/products`,
    );
  };

  return (
    <Card
      onClick={handleNavigate}
      className="cursor-pointer overflow-hidden rounded-2xl pt-0 shadow-sm transition hover:shadow-md"
    >
      <div className="h-40 w-full bg-gray-100">
        <img
          src={imageUrl ? `${import.meta.env.VITE_APP_IMAGE_URL}/${imageUrl}` : null}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="cursor-pointer text-sm font-semibold line-clamp-1 hover:text-blue-700 hover:underline">
          {name}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">Starts from</p>

        <p className="text-base font-semibold text-primary">Rs {startingPrice}</p>
      </CardContent>
    </Card>
  );
};
