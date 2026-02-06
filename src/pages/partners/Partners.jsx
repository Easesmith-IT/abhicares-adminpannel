import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Eye, Pencil, PlusIcon, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AddSellerModal from "../../components/modals/AddSellerModal";
import DeleteModal from "../../components/modals/DeleteModal";
import UnapprovedSellerModal from "../../components/modals/UnapprovedSellerModal";
import PartnersTableSkeleton from "../../components/partner/PartnersTableSkeleton";
import Stats from "../../components/partner/Stats";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";
import useGetApiReq from "../../hooks/useGetApiReq";

const Partners = () => {
  const navigate = useNavigate();

  const { res: getRes, fetchData: getSellers, isLoading } = useGetApiReq();
  const { res: filterRes, fetchData: filterSellers } = useGetApiReq();
  const { res: searchRes, fetchData: searchSellers } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteSeller } = useDeleteApiReq();

  const [sellers, setSellers] = useState([]);
  const [seller, setSeller] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unapprovedOpen, setUnapprovedOpen] = useState(false);

  const fetchAll = () => {
    getSellers(`/admin/get-all-seller?page=${page}`);
  };

  /* Fetch sellers */
  useEffect(() => {
    if (!search && !status) fetchAll();
  }, [page]);

  /* Search */
  useEffect(() => {
    if (!search) return fetchAll();
    searchSellers(`/admin/search-seller?search=${search}&page=${page}`);
  }, [search, page]);

  /* Filter */
  useEffect(() => {
    if (!status) return;
    filterSellers(`/admin/filter-seller?status=${status}&page=${page}`);
  }, [status, page]);

  console.log("Partners page", totalPages);
  /* Handle responses */
  useEffect(() => {
    const res = getRes || filterRes || searchRes;

    console.log("Partners res", res);

    if (res?.status === 200) {
      setSellers(res.data.data);
      setTotalPages(
        res.data?.pagination?.totalPages || res.data?.totalPage || 1,
      );
    }
  }, [getRes, filterRes, searchRes]);

  /* Delete */
  useEffect(() => {
    if (deleteRes?.status === 200) {
      toast.success("Partner deleted");
      setDeleteOpen(false);
      fetchAll();
    }
  }, [deleteRes]);

  return (
    <>
      <Wrapper>
        <Stats setAllSellers={setSellers} />

        <div className="mt-6">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <H2>Partners</H2>

            <Input
              placeholder="Search partners..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN-REVIEW">In Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="secondary" onClick={() => setUnapprovedOpen(true)}>
              Unapproved Partners
            </Button>

            <Button
              variant="abhicares"
              className="ml-auto"
              onClick={() => setAddOpen(true)}
            >
               <PlusIcon />
               Add Partner
            </Button>
          </div>

          <div className="table-container">
            {/* Table */}
            {isLoading ? (
              <PartnersTableSkeleton />
            ) : sellers.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No partners found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 border-b border-white/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Partner ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sellers.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.partnerId}</TableCell>
                      <TableCell>{s.categoryId?.name}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>
                        <Badge variant={s.online ? "success" : "destructive"}>
                          {s.online ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSeller(s);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            setSeller(s._id);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/admin/partners/${s._id}`, { state: s })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          <PaginationComp
            page={page}
            pageCount={totalPages}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {addOpen && (
        <AddSellerModal setIsModalOpen={setAddOpen} getAllSellers={fetchAll} />
      )}

      {editOpen && (
        <AddSellerModal
          seller={seller}
          setIsModalOpen={setEditOpen}
          getAllSellers={fetchAll}
        />
      )}

      {deleteOpen && (
        <DeleteModal
          isOpen={deleteOpen}
          setState={setDeleteOpen}
          handleDelete={() => deleteSeller(`/admin/delete-seller/${seller}`)}
        />
      )}

      {unapprovedOpen && (
        <UnapprovedSellerModal
          setIsUnapprovedSellerModalOpen={setUnapprovedOpen}
          getSellers={fetchAll}
        />
      )}
    </>
  );
};

export default Partners;
