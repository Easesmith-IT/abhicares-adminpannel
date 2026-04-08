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
import { buildQuery } from "@/utils/buildQuery";
import CityFilter from "../../components/filters/city/CityFilter";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STATUS_BADGE_VARIANT = {
  APPROVED: "success",
  "IN-REVIEW": "inprogress",
  HOLD: "secondary",
  REJECTED: "destructive",
};

const Partners = () => {
  const navigate = useNavigate();

  /* ----------------------------------
     API hooks
  ---------------------------------- */
  const { res, fetchData, isLoading } = useGetApiReq();
  const { res: deleteRes, fetchData: deleteSeller } = useDeleteApiReq();

  /* ----------------------------------
     State
  ---------------------------------- */
  const [sellers, setSellers] = useState([]);
  const [seller, setSeller] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unapprovedOpen, setUnapprovedOpen] = useState(false);
  const [cityId, setCityId] = useState("");

  const handleCreate = ()=>{
    navigate("/admin/partners/create");
  }

  const handleReset = () => {
    setCityId("");
    setStatus("");
    setSearch("");
  };

  /* ----------------------------------
     Fetch sellers (single API)
  ---------------------------------- */
  const fetchSellers = () => {
    const query = buildQuery({
      page,
      limit: 10,
      search,
      status,
      cityId,
    });

    fetchData(`/sellers/get-all-seller?${query}`);
  };

  /* ----------------------------------
     Effects
  ---------------------------------- */

  // Fetch on page / search / filter change
  useEffect(() => {
    fetchSellers();
  }, [page, search, status, cityId]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // Handle API response
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("partner res", res);

      setSellers(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);
    }
  }, [res]);

  // Handle delete
  useEffect(() => {
    if (deleteRes?.status === 200) {
      setDeleteOpen(false);
      fetchSellers();
    }
  }, [deleteRes]);

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <>
      <Wrapper>
        <Stats setAllSellers={setSellers} />

        <div className="mt-6">
          {/* Header */}
          <div className="flex justify-between gap-5 items-center">
            <H2>Partners</H2>
            <Button
              variant="abhicares"
              className="ml-auto"
              onClick={handleCreate}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3 mt-6">
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
            <CityFilter value={cityId} onChange={setCityId} />
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />

            <Button variant="secondary" onClick={() => setUnapprovedOpen(true)}>
              Unapproved Partners
            </Button>
          </div>

          {/* Table */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200">
                  <TableHead>Name</TableHead>
                  <TableHead>Partner ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Availabel Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <PartnersTableSkeleton />
                ) : sellers.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No partners found
                  </p>
                ) : (
                  sellers.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.partnerId || "-"}</TableCell>
                      <TableCell>{s.categoryId?.name}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell className="capitalize">
                        {s?.city?.cityId?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.online ? "success" : "destructive"}>
                          {s.online ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={STATUS_BADGE_VARIANT[s.status] || "default"}
                        >
                          {s.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="flex justify-end gap-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            navigate(`/admin/partners/${s._id}/update`, {
                              state: { seller:s},
                            });
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
                  ))
                )}
              </TableBody>
            </Table>
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

      {/* Modals */}
      {addOpen && (
        <AddSellerModal
          setIsModalOpen={setAddOpen}
          getAllSellers={fetchSellers}
        />
      )}

      {editOpen && (
        <AddSellerModal
          seller={seller}
          setIsModalOpen={setEditOpen}
          getAllSellers={fetchSellers}
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
          getSellers={fetchSellers}
        />
      )}
    </>
  );
};

export default Partners;
