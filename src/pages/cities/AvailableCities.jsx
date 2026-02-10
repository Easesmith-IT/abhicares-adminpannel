import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import AvailableCitiesSkeleton from "../../components/city/AvailableCitiesSkeleton";
import { PaginationComp } from "../../components/shared/PaginationComp";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SingleCityRow from "../../components/city/City";


const AvailableCities = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();

  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const fetchCities = () => {
    fetchData(`/cities/getAllCities?page=${page}`);
  };

  useEffect(() => {
    fetchCities();
  }, [page]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("get city res", res);
      
      setCities(res.data.data);
      setPageCount(res?.data?.pagination?.totalPages || 0);
    }
  }, [res]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
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
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Polygon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && <AvailableCitiesSkeleton />}

              {!isLoading && cities.length === 0 && (
                <p className="text-muted-foreground">No cities found</p>
              )}

              {cities.map((city) => (
                <SingleCityRow
                  key={city._id}
                  city={city}
                  refetchCities={fetchCities}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <PaginationComp page={page} pageCount={pageCount} setPage={setPage} />
      </div>
    </Wrapper>
  );
};

export default AvailableCities;
