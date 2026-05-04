import { useEffect, useState } from "react";

import { ServiceCard } from "./ServiceCard";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { H2 } from "../../shared/typography";
import ServiceCardSkeleton from "../ServiceCardSkeleton";
import { useLocation, useParams } from "react-router-dom";
import { PaginationComp } from "../../shared/PaginationComp";

const dummyServices = [
  {
    _id: "1",
    name: "Hair Cut",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    startingPrice: 199,
  },
  {
    _id: "2",
    name: "Facial",
    imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b",
    startingPrice: 499,
  },
  {
    _id: "3",
    name: "AC Service",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
    startingPrice: 599,
  },
  {
    _id: "4",
    name: "Bathroom Cleaning",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    startingPrice: 699,
  },
];

const Services = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [services, setServices] = useState([...dummyServices]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const params = useParams();
  const { state } = useLocation();
  console.log("state", state);

  const getServices = () => {
    fetchData(
      `/services/get-services/${params?.categoryId}?cityId=${state?.address?.cityBoundary}&page=${page}`,
    );
  };

  useEffect(() => {
    getServices();
  }, [state, page]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setServices(res.data.data || []);
      setPageCount(res?.data?.pagination?.totalPages || 0);
      console.log("res", res);
    }
  }, [res]);

  return (
    <div className="w-full font-poppins space-y-6">
      {/* Header */}
      <H2>Services</H2>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && services.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No services found
        </div>
      )}

      {/* Grid */}
      {!isLoading && services.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
            />
          ))}
        </div>
      )}

      <PaginationComp
        className="mt-5"
        page={page}
        pageCount={pageCount}
        setPage={setPage}
      />
    </div>
  );
};

export default Services;
