import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import VerifyCashSubmissionModal from "./CashSubmissionVerifyModal";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { SubmissionDetailsModal } from "./SubmissionDetailModal";

const STATUS_COLORS = {
  APPROVED: "bg-green-100 text-green-700 hover:bg-green-200",
  REJECTED: "bg-red-100 text-red-700 hover:bg-red-200",
};

const statusColor = (status) =>
  STATUS_COLORS[status] ?? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";

const CashManagementRow = ({ submission, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <TableRow>
        <TableCell
          onClick={() => setIsDetailModalOpen(true)}
          className="font-medium whitespace-nowrap cursor-pointer"
        >
          {submission.cashoutId}
        </TableCell>

        <TableCell>{submission?.seller?.name || "NA"}</TableCell>
        <TableCell>₹{submission.value}</TableCell>

        <TableCell>
          <Badge className={statusColor(submission.status)}>
            {submission.status}
          </Badge>
        </TableCell>

        <TableCell>
          {submission.createdAt &&
            format(new Date(submission.createdAt), "dd MMM, yyyy hh:mm a")}
        </TableCell>

        <TableCell>
          <div className="w-40">{submission.description || "-"}</div>
        </TableCell>

        {/* <TableCell>
          <div className="w-40">
            {submission.accountDetails?.remarks || "-"}
          </div>
        </TableCell> */}

        {/* <TableCell>
          {submission.verifiedBy?.name ? (
            <div>
              <p>{submission.verifiedBy?.name}</p>
              <p>{submission.verifiedBy?.email}</p>
              <p>{submission.verifiedBy?.phone}</p>
            </div>
          ) : (
            "-"
          )}
        </TableCell> */}
        <TableCell>
          <div className="flex gap-5 items-center">
            {submission.status === "PENDING" ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="abhicares"
                className="px-4"
              >
                Verify
              </Button>
            ) : (
              <Badge>Verified</Badge>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsDetailModalOpen(true)}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isModalOpen && (
        <VerifyCashSubmissionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen((prev) => !prev)}
          submissionId={submission?._id}
          getData={getData}
        />
      )}

      {isDetailModalOpen && (
        <SubmissionDetailsModal
          data={submission}
          isOpen={isDetailModalOpen}
          setIsOpen={setIsDetailModalOpen}
        />
      )}
    </>
  );
};

export default CashManagementRow;
