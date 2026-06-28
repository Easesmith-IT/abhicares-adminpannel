import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Pencil, Trash2, Search, RefreshCw, Plus } from "lucide-react";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";
import useDebounce from "../../hooks/useDebounce";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import Wrapper from "../../components/wrappers/Wrapper";
import AddUserModal from "../../components/modals/AddUserModal";
import AllUsersModal from "../../components/modals/AllUsersModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { CustomersTableSkeleton } from "../../components/customer/CustomersTableSkeleton";
import { buildQuery } from "../../utils/buildQuery";
import CityFilter from "../../components/filters/city/CityFilter";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { useCustomSidebar } from "@/components/layout/sidebarContext";

const getUserCityNames = (userData) => {
  const addressCities = Array.isArray(userData?.cities)
    ? userData.cities.map((city) => city?.name).filter(Boolean)
    : [];

  if (addressCities.length) {
    return addressCities;
  }

  return userData?.city?.name ? [userData.city.name] : [];
};

const Customers = () => {
  const navigate = useNavigate();

  const { res: deleteUserRes, fetchData: deleteUser } = useDeleteApiReq();
  const { res: getUsersRes, fetchData: getUsers, isLoading } = useGetApiReq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAllUsersModalOpen, setIsAllUsersModalOpen] = useState(false);

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const { selectedCityId } = useCustomSidebar();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityId, setCityId] = useState(selectedCityId || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCityId(selectedCityId || "");
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedCityId]);

  const handleReset = () => {
    setCityId(selectedCityId || "");
    setSearchQuery("");
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const getAllUsers = useCallback(() => {
    const query = buildQuery({
      page,
      limit,
      search: debouncedSearchQuery,
      cityId,
    });
    getUsers(`/users/get-all-user?${query}`);
  }, [page, limit, debouncedSearchQuery, cityId, getUsers]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (getUsersRes?.status === 200 || getUsersRes?.status === 201) {
      const timer = setTimeout(() => {
        setAllUsers(getUsersRes.data.data);
        setPageCount(getUsersRes?.data?.pagination?.totalPages || 0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [getUsersRes]);

  const handleDelete = () => {
    deleteUser(`/admin/delete-user/${user}`);
  };

  useEffect(() => {
    if (deleteUserRes?.status === 200 || deleteUserRes?.status === 201) {
      const timer = setTimeout(() => {
        getAllUsers();
        setIsDeleteModalOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [deleteUserRes, getAllUsers]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers Directory</h1>
              <p className="text-xs text-slate-500 mt-1">Manage platform users, view their details, transaction history, and referrers.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={getAllUsers} className="bg-white border-slate-200">
                <RefreshCw className="size-3.5 mr-1" />
                <span>Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAllUsersModalOpen(true)}
                className="bg-white border-slate-200"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download Directory
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
              >
                <Plus className="mr-1.5 size-4" />
                Add Customer
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search name, phone, email..."
                className="pl-9 h-9 bg-white border-slate-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <CityFilter value={cityId} onChange={setCityId} />
            <PageSizeSelect
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              label=""
              triggerClassName="bg-white border-slate-200"
            />
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
          </div>

          <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="table-container border-0 shadow-none hover:translate-y-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200/60">
                      <TableHead className="font-semibold text-slate-700 h-11 pl-6">Customer Name</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">Contact Number</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">Email Address</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">Gender</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">City</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11 text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading && <CustomersTableSkeleton rows={6} />}

                    {!isLoading && allUsers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-12 text-center text-slate-400 font-medium"
                        >
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}

                    {!isLoading && allUsers.map((u) => {
                      const cityNames = getUserCityNames(u);

                      return (
                        <TableRow key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-semibold text-[#0F172A] pl-6">{u.name || "—"}</TableCell>
                          <TableCell className="text-slate-700 font-mono text-xs">{u.phone || "—"}</TableCell>
                          <TableCell className="text-slate-600">{u.email || "—"}</TableCell>
                          <TableCell className="text-slate-600 capitalize">{u.Gender || "—"}</TableCell>
                          <TableCell className="text-slate-700">
                            {cityNames.length ? (
                              <div className="flex max-w-[280px] flex-wrap gap-1.5">
                                {cityNames.map((cityName) => (
                                  <span
                                    key={`${u._id}-${cityName}`}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                                  >
                                    {cityName}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setUser(u);
                                  setIsUpdateModalOpen(true);
                                }}
                                className="hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  setUser(u._id);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="h-8 w-8 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  navigate(`/admin/customers/${u._id}`, {
                                    state: u,
                                  })
                                }
                                className="hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Page {page} of {pageCount}</span>
            <PaginationComp
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />
          </div>
        </div>
      </Wrapper>

      {isModalOpen && (
        <AddUserModal
          setIsModalOpen={setIsModalOpen}
          getAllUsers={getAllUsers}
        />
      )}

      {isUpdateModalOpen && (
        <AddUserModal
          setIsModalOpen={setIsUpdateModalOpen}
          user={user}
          getAllUsers={getAllUsers}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setState={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      )}

      {isAllUsersModalOpen && (
        <AllUsersModal setIsModalOpen={setIsAllUsersModalOpen} />
      )}
    </>
  );
};

export default Customers;
