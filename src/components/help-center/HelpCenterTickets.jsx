import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useGetApiReq from "../../hooks/useGetApiReq";
import useDeleteApiReq from "../../hooks/useDeleteApiReq";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import DeleteModal from "../modals/DeleteModal";
import { PaginationComp } from "../shared/PaginationComp";
import { TicketRowSkeleton } from "./TicketRowSkeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HelpCenterTickets = () => {
  const navigate = useNavigate();
  const { res, fetchData, isLoading } = useGetApiReq();
   const {
     res: filterRes,
     fetchData: filterTickets,
     isLoading: filterLoading,
   } = useGetApiReq();
   const { res: deleteRes, fetchData: deleteTicket } = useDeleteApiReq();
   const { res: categoriesRes, fetchData: getCategories } = useGetApiReq();

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({
      date: "",
      serviceType: "",
      raisedBy: "",
      searchQuery: "",
    });

     const handleDelete = async () => {
       deleteTicket(`/admin/delete-ticket?ticketId=${selectedId}`);
     };

  const getAllTickets = () => {
    fetchData(
      `/admin/get-all-tickets?page=${page}&ticketId=${filters.searchQuery}`,
    );
  };

  const applyFilters = () => {
    filterTickets(
      `/admin/filter-ticket?date=${filters.date}&serviceType=${filters.serviceType}&raisedBy=${filters.raisedBy}&page=${page}`,
    );
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    getCategories("/admin/get-all-category");
  }, []);

  useEffect(() => {
    if (categoriesRes?.status === 200) {
      setCategories(categoriesRes.data.data);
    }
  }, [categoriesRes]);

  useEffect(() => {
    if (
      !filters.date &&
      !filters.serviceType &&
      !filters.raisedBy &&
      filters.searchQuery
    ) {
      getAllTickets();
    } else {
      applyFilters();
    }
  }, [
    page,
    filters.date,
    filters.serviceType,
    filters.raisedBy,
    filters.searchQuery,
  ]);

  useEffect(() => {
    if (res?.status === 200) {
      setTickets(res.data.data);
      setPageCount(res.data.totalPages);
    }
  }, [res]);

  useEffect(() => {
    if (filterRes?.status === 200) {
      setTickets(filterRes.data.data);
      setPageCount(filterRes.data.totalPages);
    }
  }, [filterRes]);

  useEffect(() => {
    if (deleteRes?.status === 200) {
      toast.success("Ticket deleted");
      getAllTickets();
      setSelectedId(null);
    }
  }, [deleteRes]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search by Ticket ID"
          value={filters.searchQuery}
          onChange={(e) =>
            setFilters({ ...filters, searchQuery: e.target.value })
          }
        />

        <Input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <Select
          value={filters.serviceType}
          onValueChange={(value) =>
            setFilters({ ...filters, serviceType: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Service Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.raisedBy}
          onValueChange={(value) => setFilters({ ...filters, raisedBy: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Raised By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="table-container mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Raised By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(isLoading || filterLoading) &&
              Array.from({ length: 5 }).map((_, i) => (
                <TicketRowSkeleton key={i} />
              ))}

            {!isLoading && !filterLoading && tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No tickets found
                </TableCell>
              </TableRow>
            )}

            {tickets.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.ticketId}</TableCell>
                <TableCell>{t.raisedBy || "NA"}</TableCell>
                <TableCell>
                  {format(new Date(t.createdAt), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      t.status === "in-review"
                        ? "secondary"
                        : t.status === "raised"
                          ? "outline"
                          : "success"
                    }
                    className="capitalize"
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/help-center/tickets/${t._id}`)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setSelectedId(t._id)}
                    size="icon"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

      {selectedId && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default HelpCenterTickets;
