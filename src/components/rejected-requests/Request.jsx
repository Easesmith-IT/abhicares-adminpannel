import { format } from "date-fns";
import React, { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { CheckCircleIcon, EyeIcon, XCircleIcon } from "lucide-react";
import ApproveRejectRequestModal from "./ApproveRejectRequestModal";
import { useNavigate } from "react-router-dom";

const getRequestStatusClasses = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "approved":
      return "bg-green-600 text-white";
    case "rejected":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

const Request = ({ item, refetch }) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {item.requestId.slice(-8)}
        </TableCell>

        <TableCell>{item.booking?.bookingId}</TableCell>

        <TableCell>
          <div>
            <p className="font-medium">{item.seller?.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.seller?.phone}
            </p>
          </div>
        </TableCell>

        <TableCell>
          <div>
            <p className="font-medium">{item.booking?.userId?.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.booking?.userId?.phone}
            </p>
          </div>
        </TableCell>

        <TableCell>
          {item.booking?.bookingDate &&
            format(new Date(item.booking.bookingDate), "dd-MM-yyyy")}
          <p>
            {item.booking?.bookingTime &&
              format(new Date(item.booking.bookingTime), "hh:mm aa")}
          </p>
        </TableCell>

        <TableCell
          className="w-[200px] whitespace-pre-wrap"
          title={item.reason}
        >
          {item.reason}
        </TableCell>
        <TableCell
          className="w-[200px] whitespace-pre-wrap"
          title={item.adminNote}
        >
          {item.adminNote}
        </TableCell>

        <TableCell>
          <span
            className={`rounded px-2 py-1 text-sm font-semibold capitalize ${getRequestStatusClasses(
              item.status,
            )}`}
          >
            {item.status}
          </span>
        </TableCell>

        <TableCell>
          {item.requestedAt && format(new Date(item.requestedAt), "dd-MM-yyyy")}
        </TableCell>

        <TableCell>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/admin/bookings/rejected-request/${item?.requestId}`,
                  { state: { requestData: item } },
                )
              }
            >
              <EyeIcon />
            </Button>
            <Button
              disabled={item.status !== "pending"}
              onClick={() => setApproveOpen(true)}
            >
              <CheckCircleIcon />
            </Button>

            <Button
              disabled={item.status !== "pending"}
              variant="destructive"
              onClick={() => setRejectOpen(true)}
            >
              <XCircleIcon />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {approveOpen && (
        <ApproveRejectRequestModal
          open={approveOpen}
          setOpen={setApproveOpen}
          requestId={item.requestId}
          mode="approve"
          refetch={refetch}
        />
      )}

      {rejectOpen && (
        <ApproveRejectRequestModal
          open={rejectOpen}
          setOpen={setRejectOpen}
          requestId={item.requestId}
          mode="reject"
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Request;
