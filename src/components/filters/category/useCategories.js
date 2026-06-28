import { useEffect, useState, useCallback } from "react";
import useGetApiReq from "@/hooks/useGetApiReq";

const LIMIT = 10;

const useCategories = () => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(() => {
    fetchData(`/categories/get-categories?page=${page}&limit=${LIMIT}`);
  }, [ page]);

  useEffect(() => {
    fetchCategories();
  }, [ page]);

  useEffect(() => {
    if (res?.status !== 200 && res?.status !== 201) return;
    const { data, pagination } = res.data;
    setCategories(data || []);
    setTotalPages(pagination?.totalPages || 1);
  }, [res]);

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    categories,
    page,
    totalPages,
    isLoading,
    nextPage,
    prevPage,
  };
};

export default useCategories;
