import parse from "html-react-parser";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CityFilter } from "@/components/filters/city";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ServiceCardSkeleton from "../../components/category/ServiceCardSkeleton";
import AddServiceModal from "../../components/modals/AddServiceModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { BackLink } from "../../components/shared/back-link";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";
import { buildQuery } from "../../utils/buildQuery";
import { PaginationComp } from "../../components/shared/PaginationComp";

const CategoryServices = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteService } = useDeleteApiReq();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { categoryId } = useParams();

  const handleReset = () => {
    setSelectedCity("");
  };

  const fetchServices = () => {
    const query = buildQuery({ city: selectedCity });
    fetchData(`/services/get-category-service/${categoryId}?${query}`);
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCity]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);
      
      setServices(res.data.data || []);
      setPageCount(res?.data?.pagination?.totalPages || 0);
    }
  }, [res]);

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      toast.success("Service deleted successfully");
      setIsDeleteOpen(false);
      fetchServices();
    }
  }, [deleteRes]);

  const handleDelete = () => {
    deleteService(`/admin/delete-service/${selectedService}`);
  };

  return (
    <>
      <Wrapper>
        <div className="w-full font-poppins">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <div>
              <BackLink href={-1}>
                <H2>Services</H2>
              </BackLink>
              <p className="mt-2 text-sm text-muted-foreground">
                {state?.categoryName}
              </p>
            </div>

            <div className="flex gap-3">
              <CityFilter
                value={selectedCity}
                onChange={setSelectedCity}
              />
              <TooltipIconButton
                tooltip="Reset Filters"
                onClick={handleReset}
              />

              <Button variant="abhicares" asChild>
                <Link to={`/admin/services/${categoryId}/add-service`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Link>
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && services.length === 0 && (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No service found
            </div>
          )}

          {/* Cards */}
          {!isLoading && services.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service._id}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() =>
                    navigate(
                      `/admin/services/${categoryId}/product/${service._id}`,
                      { state: service },
                    )
                  }
                >
                  {/* Image */}
                  <img
                    src={`${import.meta.env.VITE_APP_IMAGE_URL}/${service.imageUrl}`}
                    alt={service.name}
                    className="h-[150px] w-full rounded-t-xl object-cover"
                  />

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{service.name}</CardTitle>

                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedService(service);
                            navigate(
                              `/admin/services/${categoryId}/update-service/${service?._id}`,
                              { state: { service } },
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            setSelectedService(service._id);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="text-sm text-muted-foreground line-clamp-3">
                    {parse(service.description)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <PaginationComp className="mt-5" page={page} pageCount={pageCount} setPage={setPage} />
        </div>
      </Wrapper>

      {/* Modals */}
      {isAddOpen && (
        <AddServiceModal
          setIsModalOpen={setIsAddOpen}
          isModalOpen={isAddOpen}
          categoryId={categoryId}
          getCategoryServices={fetchServices}
        />
      )}

      {isEditOpen && (
        <AddServiceModal
          setIsModalOpen={setIsEditOpen}
          isModalOpen={isEditOpen}
          service={selectedService}
          getCategoryServices={fetchServices}
        />
      )}

      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setState={setIsDeleteOpen}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CategoryServices;
