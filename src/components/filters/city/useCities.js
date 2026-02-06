import { useCallback, useEffect, useState } from "react";
import useGetApiReq from "@/hooks/useGetApiReq";

const LIMIT = 5;

const useCities = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchCities = useCallback(
    ({ page = 1, search = "" } = {}) => {
      fetchData(
        `/admin/get-availabe-city?page=${page}&limit=${LIMIT}&search=${search}`,
      );
    },
    [fetchData],
  );

  // Fetch on page / search change
  useEffect(() => {
    fetchCities({ page, search });
  }, [page, search]);

  // Handle response
  useEffect(() => {
    if (res?.status !== 200 && res?.status !== 201) return;

    const { data, pagination } = res.data;
    console.log("data", data);
    

    setCities(data || []);
    setTotalPages(pagination?.totalPages || 1);
  }, [res]);

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const onSearch = (value) => {
    setPage(1);
    setSearch(value);
  };

  return {
    cities,
    page,
    totalPages,
    isLoading,
    nextPage,
    prevPage,
    onSearch,
  };
};

export default useCities;
