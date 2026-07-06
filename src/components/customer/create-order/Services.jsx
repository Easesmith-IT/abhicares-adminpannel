import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { ServiceCard } from "./ServiceCard";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { H2 } from "../../shared/typography";
import ServiceCardSkeleton from "../ServiceCardSkeleton";
import { PaginationComp } from "../../shared/PaginationComp";

const Services = () => {
  const { res, fetchData, isLoading } = useGetApiReq();
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const params = useParams();
  const draft = useSelector((state) => state.createOrderDraft);

  useEffect(() => {
    if (draft.cityId) {
      fetchData(
        `/services/get-services/${params?.categoryId}?cityId=${draft.cityId}&page=${page}`,
      );
    }
  }, [draft.cityId, fetchData, page, params?.categoryId]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      setServices(res.data.data || []);
      setPageCount(res?.data?.pagination?.totalPages || 0);
    }
  }, [res]);

  if (!draft.selectedAddress?._id) {
    return (
      <Navigate
        to={`/admin/customers/${params.customerId}/create-order`}
        replace
      />
    );
  }

  return (
    <div className="w-full space-y-6 font-poppins">
      <div className="space-y-2">
        <H2>Services</H2>
        <p className="text-sm text-slate-600">
          Pick a service, add what you need, then come back for more. The draft
          cart supports mixed services and mixed categories.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && services.length === 0 && (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No services found
        </div>
      )}

      {!isLoading && services.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
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
