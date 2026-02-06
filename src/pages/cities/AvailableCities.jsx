import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import AvailableCitiesSkeleton from "../../components/city/AvailableCitiesSkeleton";
import AddCityModal from "../../components/modals/AddCityModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { CityPolygonModal } from "../../components/city/city-polygon-modal";
import { PaginationComp } from "../../components/shared/PaginationComp";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "../../components/ui/spinner";
import { Switch } from "../../components/ui/switch";

const AvailableCities = () => {
  const {
    res: deleteCityRes,
    fetchData: deleteCity,
    isLoading: deleteCityLoading,
  } = useDeleteApiReq();

  const { res: getCitiesRes, fetchData: getCities, isLoading } = useGetApiReq();
  const isTogglePending = false;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPolygonOpen, setIsPolygonOpen] = useState(false);

  const [city, setCity] = useState({});
  const [allCities, setAllCities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(city?.isActive || false);

  const navigate = useNavigate();

  const toggleStatus = () => {
    setIsActive((prev) => !prev);
  };

  const getAllCities = () => {
    getCities(`/admin/get-availabe-city?page=${page}`);
  };

  useEffect(() => {
    getAllCities();
  }, [page]);

  useEffect(() => {
    if (getCitiesRes?.status === 200 || getCitiesRes?.status === 201) {
      setPageCount(getCitiesRes?.data?.pagination?.totalPages);
      setAllCities(getCitiesRes?.data?.data);
    }
  }, [getCitiesRes]);

  const handleUpdate = (city) => {
    setCity(city);
    navigate(`/admin/available-cities/${city?._id || city?.id}/update`, {
      state: city,
    });
  };

  const handlePolygon = (city) => {
    setCity(city);
    setIsPolygonOpen(true);
  };

  const handleDeleteModal = (id) => {
    setCity(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    deleteCity(`/admin/delete-availabe-city/${city}`);
  };

  useEffect(() => {
    if (deleteCityRes?.status === 200 || deleteCityRes?.status === 201) {
      toast.success("City deleted successfully");
      getAllCities();
      setIsDeleteModalOpen(false);
    }
  }, [deleteCityRes]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Available Cities</h1>
            <Button
              variant="abhicares"
              onClick={() => navigate("/admin/available-cities/add")}
            >
              Add City
            </Button>
          </div>

          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 border-b border-white/40">
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Pincodes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <AvailableCitiesSkeleton />}

                {!isLoading && allCities?.length === 0 && (
                  <p className="text-muted-foreground">No cities found</p>
                )}

                {allCities.map((city) => {
                  const hasPolygon = city?.area?.coordinates?.[0]?.length > 2;

                  return (
                    <TableRow key={city._id}>
                      <TableCell className="capitalize">{city.city}</TableCell>

                      <TableCell>{city.state}</TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={city.isActive ? "success" : "destructive"}
                          >
                            {isTogglePending ? (
                              <Spinner />
                            ) : city.isActive ? (
                              "Active"
                            ) : (
                              "Inactive"
                            )}
                          </Badge>

                          <Switch
                            checked={isActive}
                            onCheckedChange={toggleStatus}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={hasPolygon ? "success" : "secondary"}>
                            {hasPolygon ? "Added" : "Not Added"}
                          </Badge>

                          {hasPolygon && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePolygon(city)}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdate(city)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDeleteModal(city._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-6 mb-5"
          />
        </div>
      </Wrapper>

      {/* Modals */}
      {isPolygonOpen && (
        <CityPolygonModal
          city={city}
          isOpen={isPolygonOpen}
          onClose={() => setIsPolygonOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteModalOpen}
          isLoading={deleteCityLoading}
        />
      )}
    </>
  );
};

export default AvailableCities;
