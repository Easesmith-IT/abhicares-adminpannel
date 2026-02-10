import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Spinner } from "../../components/ui/spinner";
import { TableRow, TableCell } from "@/components/ui/table";

import DeleteModal from "../../components/modals/DeleteModal";
import { CityPolygonModal } from "../../components/city/city-polygon-modal";
import { useNavigate } from "react-router-dom";

const SingleCityRow = ({ city, onUpdate, refetchCities }) => {
  const [isActive, setIsActive] = useState(city.isActive);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPolygonOpen, setIsPolygonOpen] = useState(false);
  const navigate = useNavigate();

  const {
    res: toggleRes,
    fetchData: toggleCity,
    isLoading: toggleLoading,
  } = usePatchApiReq();

  const {
    res: deleteRes,
    fetchData: deleteCity,
    isLoading: deleteLoading,
  } = useDeleteApiReq();

  const hasPolygon = city?.area?.coordinates?.[0]?.length > 2;

  /* ---------------- Toggle Status ---------------- */
  const toggleStatus = () => {
    setIsActive((prev) => !prev);
    toggleCity(`/cities/admin/cities/toggle/${city._id}`);
  };

  useEffect(() => {
    if (toggleRes?.status === 200 || toggleRes?.status === 201) {
      refetchCities();
    }
  }, [toggleRes]);

  /* ---------------- Delete City ---------------- */
  const handleDelete = () => {
    deleteCity(`/cities/admin/cities/${city._id}`);
  };

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      // toast.success("City deleted successfully");
      setIsDeleteOpen(false);
      refetchCities();
    }
  }, [deleteRes]);

  return (
    <>
      <TableRow>
        <TableCell className="capitalize">{city.name}</TableCell>
        <TableCell>{city.latitude}</TableCell>
        <TableCell>{city.longitude}</TableCell>

        {/* Status */}
        <TableCell>
          <div className="flex flex-col gap-1">
            <Badge variant={isActive ? "success" : "destructive"}>
              {toggleLoading ? <Spinner /> : isActive ? "Active" : "Inactive"}
            </Badge>

            <Switch
              checked={isActive}
              onCheckedChange={toggleStatus}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
            />
          </div>
        </TableCell>

        {/* Polygon */}
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge variant={hasPolygon ? "success" : "secondary"}>
              {hasPolygon ? "Added" : "Not Added"}
            </Badge>

            {hasPolygon && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPolygonOpen(true)}
              >
                View
              </Button>
            )}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                navigate(
                  `/admin/available-cities/${city?._id || city?.id}/update`,
                  {
                    state: city,
                  },
                )
              }
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Polygon Modal */}
      {isPolygonOpen && (
        <CityPolygonModal
          city={city}
          isOpen={isPolygonOpen}
          onClose={() => setIsPolygonOpen(false)}
        />
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteOpen}
          isLoading={deleteLoading}
        />
      )}
    </>
  );
};

export default SingleCityRow;
