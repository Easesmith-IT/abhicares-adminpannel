import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UpdatePwdModal from "../../components/modals/UpdatePwd";

import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddSubAdminModal from "../../components/modals/AddSubAdminModal";
import DeleteModal from "../../components/modals/DeleteModal";
import SeoModal from "../../components/modals/SeoModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import Wrapper from "../../components/wrappers/Wrapper";
import AutoAssignSetting from "../../components/settings/AutoAssignSetting";

const Settings = () => {
  const {
    res: deleteSubAdminRes,
    fetchData: deleteSubAdmin,
    isLoading: deleteSubAdminLoading,
  } = useDeleteApiReq();

  const {
    res: getSubAdminsRes,
    fetchData: getSubAdmins,
    isLoading,
  } = useGetApiReq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatePwdModal, setUpdatePwdModal] = useState(false);
  const [subAdmin, setSubadmin] = useState({});
  const [allSubadmins, setAllSubadmins] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const handlePageClick = (page) => setPage(page);

  const handleUpdateModal = (data) => {
    setSubadmin(data);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteModal = (data) => {
    setSubadmin(data);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    deleteSubAdmin(
      `/admin/delete-sub-admin?subAdminId=${subAdmin?._id}&role=${subAdmin?.role}`,
    );
  };

  const getSubadmins = async () => {
    getSubAdmins(`/admin/get-sub-admins?page=${page}`);
  };

  useEffect(() => {
    getSubadmins();
  }, [page]);

  useEffect(() => {
    if (getSubAdminsRes?.status === 200 || getSubAdminsRes?.status === 201) {
      setPageCount(getSubAdminsRes?.data?.pagination?.totalPages);
      setAllSubadmins(getSubAdminsRes?.data?.admins);
    }
  }, [getSubAdminsRes]);

  useEffect(() => {
    if (
      deleteSubAdminRes?.status === 200 ||
      deleteSubAdminRes?.status === 201
    ) {
      // toast.success("Subadmin deleted successfully");
      setIsDeleteModalOpen(false);
      getSubadmins();
    }
  }, [deleteSubAdminRes]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/admin/rewards?tab=config")}
              >
                Manage Rewards & Referrals
              </Button>

              <Button
                variant="secondary"
                onClick={() => setIsSeoModalOpen(true)}
              >
                Manage SEO
              </Button>

              <Button variant="abhicares" onClick={() => setIsModalOpen(true)}>
                Add Subadmin
              </Button>

              <Button
                variant="secondary"
                onClick={() => setUpdatePwdModal(true)}
              >
                Update Password
              </Button>
            </div>
          </div>

          <AutoAssignSetting />

          {/* Content */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 border-b border-white/40">
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Skeleton */}
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <SubAdminRowSkeleton key={i} />
                  ))}

                {/* Empty */}
                {!isLoading && allSubadmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No subAdmins found
                    </TableCell>
                  </TableRow>
                )}

                {/* Data */}
                {!isLoading &&
                  allSubadmins.map((subadmin) => (
                    <TableRow key={subadmin._id}>
                      <TableCell className="font-medium">
                        {subadmin.name}
                      </TableCell>

                      <TableCell>{subadmin.adminId}</TableCell>

                      <TableCell className="capitalize">
                        {subadmin.role}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={subadmin.status ? "success" : "destructive"}
                        >
                          {subadmin.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button
                            onClick={() => handleUpdateModal(subadmin)}
                            size="icon"
                            variant="outline"
                          >
                            <Pencil className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" />
                          </Button>

                          <Button
                            onClick={() => handleDeleteModal(subadmin)}
                            size="icon"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {/* Modals */}
      {isSeoModalOpen && <SeoModal setIsModalOpen={setIsSeoModalOpen} />}

      {isModalOpen && (
        <AddSubAdminModal
          setIsModalOpen={setIsModalOpen}
          getSubadmins={getSubadmins}
        />
      )}

      {isUpdateModalOpen && (
        <AddSubAdminModal
          setIsModalOpen={setIsUpdateModalOpen}
          getSubadmins={getSubadmins}
          subAdmin={subAdmin}
        />
      )}

      {updatePwdModal && <UpdatePwdModal setIsModalOpen={setUpdatePwdModal} />}

      {isDeleteModalOpen && (
        <DeleteModal
          setState={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Settings;

const SubAdminRowSkeleton = () => {
  return (
    <TableRow className="border-b">
      <TableCell className="p-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="p-4">
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell className="p-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className="p-4 text-right">
        <Skeleton className="h-5 w-14 ml-auto" />
      </TableCell>
    </TableRow>
  );
};
