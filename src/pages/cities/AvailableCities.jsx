import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import Wrapper from "../../components/wrappers/Wrapper";
import AvailableCitiesSkeleton from "../../components/city/AvailableCitiesSkeleton";
import AddCityModal from "../../components/modals/AddCityModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { Badge } from "../../components/ui/badge";
import { CityPolygonModal } from "../../components/city/city-polygon-modal";
import { PaginationComp } from "../../components/shared/PaginationComp";

const AvailableCities = () => {
  const {
    res: deleteCityRes,
    fetchData: deleteCity,
    isLoading: deleteCityLoading,
  } = useDeleteApiReq();

  const { res: getCitiesRes, fetchData: getCities, isLoading } = useGetApiReq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPolygonOpen, setIsPolygonOpen] = useState(false);

  const [city, setCity] = useState({});
  const [allCities, setAllCities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

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

  const handleUpdateModal = (city) => {
    setCity(city);
    setIsUpdateModalOpen(true);
  };
  const handlePolygonModal = (city) => {
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
            <Button variant="abhicares" onClick={() => setIsModalOpen(true)}>
              Add City
            </Button>
          </div>

          <Separator />

          {isLoading && <AvailableCitiesSkeleton />}

          {!isLoading && allCities?.length === 0 && (
            <p className="text-muted-foreground">No cities found</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCities?.map((city) => {
              const hasPolygon = city?.area?.coordinates?.[0]?.length > 2;

              return (
                <Card key={city._id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base capitalize">
                      {city.city}
                    </CardTitle>

                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateModal(city)}
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
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">State:</span> {city.state}
                    </p>
                    <p>
                      <span className="font-medium">Pincodes:</span>{" "}
                      {city.pinCodes.map((item) => item?.code).join(", ") ||
                        "NA"}
                    </p>
                    <div className="flex items-center gap-2">
                      Polygon:
                      <Badge variant={hasPolygon ? "success" : "secondary"}>
                        {hasPolygon ? "Added" : "Not Added"}
                      </Badge>
                      {hasPolygon && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePolygonModal(city)}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {isPolygonOpen && (
        <CityPolygonModal
          city={city}
          isOpen={isPolygonOpen}
          onClose={() => setIsPolygonOpen(false)}
        />
      )}

      {isModalOpen && (
        <AddCityModal
          setIsModalOpen={setIsModalOpen}
          getAllCities={getAllCities}
        />
      )}

      {isUpdateModalOpen && (
        <AddCityModal
          setIsModalOpen={setIsUpdateModalOpen}
          getAllCities={getAllCities}
          city={city}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteModalOpen}
        />
      )}
    </>
  );
};

export default AvailableCities;
