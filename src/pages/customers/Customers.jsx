import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

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
import { Skeleton } from "@/components/ui/skeleton";

import Wrapper from "../../components/wrappers/Wrapper";
import AddUserModal from "../../components/modals/AddUserModal";
import AllUsersModal from "../../components/modals/AllUsersModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { CustomersTableSkeleton } from "../../components/customer/CustomersTableSkeleton";

const Customers = () => {
  const navigate = useNavigate();

  const { res: deleteUserRes, fetchData: deleteUser } = useDeleteApiReq();
  const { res: getUsersRes, fetchData: getUsers, isLoading } = useGetApiReq();
  const {
    res: searchUserRes,
    fetchData: searchUser,
    isLoading: isSearchUserLoading,
  } = useGetApiReq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAllUsersModalOpen, setIsAllUsersModalOpen] = useState(false);

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- API ---------------- */

  const getAllUsers = () => {
    getUsers(`/admin/get-all-user?page=${page}`);
  };

  useEffect(() => {
    if (getUsersRes?.status === 200 || getUsersRes?.status === 201) {
      setAllUsers(getUsersRes.data.data);
      setPageCount(getUsersRes.data.totalPage);
    }
  }, [getUsersRes]);

  const handleDelete = () => {
    deleteUser(`/admin/delete-user/${user}`);
  };

  useEffect(() => {
    if (deleteUserRes?.status === 200 || deleteUserRes?.status === 201) {
      toast.success("User deleted successfully");
      getAllUsers();
      setIsDeleteModalOpen(false);
    }
  }, [deleteUserRes]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    if (!searchQuery) {
      getAllUsers();
      return;
    }

    searchUser(`/admin/search-user?search=${searchQuery}&page=${page}`);
  }, [page, searchQuery]);

  useEffect(() => {
    if (searchUserRes?.status === 200 || searchUserRes?.status === 201) {
      setAllUsers(searchUserRes.data.data);
      setPageCount(searchUserRes.data.pagination?.totalPages);
    }
  }, [searchUserRes]);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Wrapper>
        <div className="w-full font-poppins">
          {/* ===== Header (Orders style) ===== */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <h1 className="text-[30px] font-semibold text-black">Customers</h1>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsAllUsersModalOpen(true)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>

              <Input
                placeholder="Search customers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[260px]"
              />
            </div>
          </div>

          {/* ===== Table ===== */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(isLoading || isSearchUserLoading) && (
                  <CustomersTableSkeleton rows={6} />
                )}

                {!isLoading &&
                  !isSearchUserLoading &&
                  allUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-6 text-center text-sm text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  )}

                {allUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setUser(u);
                            setIsUpdateModalOpen(true);
                          }}
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
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ===== Pagination ===== */}
          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {/* ===== Modals ===== */}
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
