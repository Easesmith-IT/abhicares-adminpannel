import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

import useDeleteApiReq from "@/hooks/useDeleteApiReq";
import usePostApiReq from "@/hooks/usePostApiReq";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import DeleteModal from "@/components/modals/DeleteModal";
import { Link } from "react-router-dom";

const OfferRow = ({ offer, refetch, onEdit }) => {
  const { fetchData: deleteOffer, res: deleteRes } = useDeleteApiReq();
  const { fetchData: updateStatus } = usePostApiReq();

  const [openDelete, setOpenDelete] = useState(false);
  const [status, setStatus] = useState(offer.isActive);

  /* ---------------- Delete ---------------- */

  const handleDelete = () => {
    deleteOffer(`/offers/delete-offer/${offer._id}`);
  };

  useEffect(() => {
    
    
    
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      setOpenDelete(false);
      refetch();
    }
  }, [deleteRes])

  /* ---------------- Status Toggle ---------------- */

  const toggleStatus = async () => {
    setStatus((prev) => !prev); // optimistic

    const res = await updateStatus(`/admin/update-offer-status/${offer._id}`, {
      isActive: !status,
    });

    if (!res?.success) {
      setStatus((prev) => !prev);
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {offer.name}
          <div className="text-xs text-muted-foreground">{offer.code}</div>
        </TableCell>

        <TableCell>{offer.type}</TableCell>

        <TableCell>
          {offer.createdAt && format(new Date(offer.createdAt), "dd-MM-yyyy")}
        </TableCell>
        <TableCell>
          {offer.validTo && format(new Date(offer.validTo), "dd-MM-yyyy")}
        </TableCell>
        <TableCell>
          {offer.validFrom && format(new Date(offer.validFrom), "dd-MM-yyyy")}
        </TableCell>

        <TableCell>
          <Badge
            onClick={toggleStatus}
            className={`cursor-pointer ${
              status ? "bg-green-600" : "bg-gray-400"
            }`}
          >
            {status ? "Active" : "Inactive"}
          </Badge>
        </TableCell>

        <TableCell className="text-right space-x-2">
          {/* Details */}
          <Button variant="outline" size="icon" asChild>
            <Link to={`/admin/offers/${offer._id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>

          {/* Edit */}
          <Button variant="outline" size="icon">
            <Link to={`/admin/offers/${offer._id}/update`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpenDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {openDelete && (
        <DeleteModal handleDelete={handleDelete} setState={setOpenDelete} />
      )}
    </>
  );
};

export default OfferRow;
