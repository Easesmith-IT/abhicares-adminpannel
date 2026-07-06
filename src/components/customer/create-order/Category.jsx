import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import { setSelectedCategory } from "../../../store/slices/createOrderDraftSlice";

export const Category = ({ category }) => {
  const { name, imageUrl, _id, id } = category;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const categoryId = _id || id;

  const handleNavigate = () => {
    dispatch(
      setSelectedCategory({
        id: categoryId,
        name,
      }),
    );

    navigate(
      `/admin/customers/${params?.customerId}/create-order/userAddresses/categories/${categoryId}/services`,
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm transition hover:shadow-md">
      <div
        onClick={handleNavigate}
        className="relative h-40 w-full cursor-pointer bg-gray-100"
      >
        <img
          src={imageUrl ? `${import.meta.env.VITE_APP_IMAGE_URL}/${imageUrl}` : null}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4 pt-0">
        <h3
          onClick={handleNavigate}
          className="cursor-pointer text-sm font-semibold line-clamp-1 hover:text-blue-700 hover:underline"
        >
          {name}
        </h3>
      </CardContent>
    </Card>
  );
};
