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
}) => {
  return (
    <div className="border bg-white mt-10">
      <Table>
        <TableHeader>
          <TableRow>
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
        <PaginationComp
          page={page}
          pageCount={pageCount}
          setPage={setPage}
          className="mt-8 mb-5"
        />
      )}
    </div>
  );
};
