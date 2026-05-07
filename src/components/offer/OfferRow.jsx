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
import useGetApiReq from "../../hooks/useGetApiReq";
import { Switch } from "../ui/switch";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { Spinner } from "../ui/spinner";

const OfferRow = ({ offer, refetch, onEdit }) => {
  const { fetchData: deleteOffer, res: deleteRes } = useDeleteApiReq();
  const { res:incrementRes,fetchData,isLoading:isIncrementLoading } = usePostApiReq();
  const { res, fetchData: hideUnhideOffer, isLoading } = usePatchApiReq();

  const [openDelete, setOpenDelete] = useState(false);
  const [status, setStatus] = useState(offer.isActive);
  const [isHidden, setIsHidden] = useState(offer.isHidden || false);

  /* ---------------- Delete ---------------- */

  const handleDelete = () => {
    deleteOffer(`/offers/delete-offer/${offer._id}`);
  };

  useEffect(() => {
    if (deleteRes?.status === 200 || deleteRes?.status === 201) {
      setOpenDelete(false);
      refetch();
    }
  }, [deleteRes]);

  /* ---------------- Status Toggle ---------------- */

  const incrementUsage = async () => {

    await fetchData(`/offers/increment-usage`, {
      offerId: offer._id,
    });
  };

   useEffect(() => {
    if (incrementRes?.status === 200 || incrementRes?.status === 201) {
      refetch();
    }
  }, [incrementRes]);

  const toggleHidden = () => {
    setIsHidden((prev) => !prev);
    hideUnhideOffer(`/offers/toggle-hidden/${offer?._id}`);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);
    }
  }, [res]);

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
            // onClick={toggleStatus}
            className={`cursor-pointer ${
              status ? "bg-green-600" : "bg-gray-400"
            }`}
          >
            {status ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell className="flex flex-col items-center justify-center gap-2">
          <Badge
            // onClick={toggleHidden}
            className={`cursor-pointer ${
              isHidden ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {isLoading ? <Spinner /> : isHidden ? "Hidden" : "Vsible"}
          </Badge>
          <Switch
            checked={isHidden}
            onCheckedChange={toggleHidden}
            // className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
            />
        </TableCell>

        <TableCell className="text-center space-x-2">
          <p className="text-sm mb-1">Uses Count:{offer?.usesCount || 0}</p>
          <Button
            variant="abhicares"
            size="xs"
            onClick={incrementUsage}
            >
            {isIncrementLoading ? <Spinner /> : "Increment Usage"}
          </Button>
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
