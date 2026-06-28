import DataNotFound from "@/components/shared/DataNotFound";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Submission from "./Submission";
import { PaginationComp } from "../../../components/shared/PaginationComp";
import { CashSubmissionTableSkeleton } from "./CashSubmissionTableSkeleton";

export const CashSubmissionTable = ({
  submissions,
  isLoading,
  getCashSubmissions,
  setPage,
  pageCount,
  page,
  limit,
  setLimit,
}) => {
  return (
    <div className="table-container mt-10">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead>Cashout Id</TableHead>
            <TableHead className="whitespace-nowrap">Amount (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="whitespace-nowrap">Submitted On</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Admin Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {isLoading ? (
          <CashSubmissionTableSkeleton />
        ) : (
          <TableBody>
            {submissions.map((submission) => (
              <Submission
                key={submission._id}
                submission={submission}
                getData={getCashSubmissions}
              />
            ))}
          </TableBody>
        )}
      </Table>

      {!isLoading && submissions.length === 0 && (
        <DataNotFound name="Submissions" />
      )}

      {!isLoading && (
        <div className="mt-8 mb-5 flex items-center justify-end gap-3">
          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};
