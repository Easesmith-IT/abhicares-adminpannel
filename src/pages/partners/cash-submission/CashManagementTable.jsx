import DataNotFound from "@/components/shared/DataNotFound";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaginationComp } from "../../../components/shared/PaginationComp";
import CashManagementRow from "./CashManagementRow";
import { CashSubmissionTableSkeleton } from "./CashSubmissionTableSkeleton";

export const CashManagementTable = ({
  submissions =[],
  isLoading,
  getCashSubmissions,
  setPage,
  pageCount,
  page,
}) => {
  return (
    <div className="table-container mt-10">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead>Cashout Id</TableHead>
            <TableHead>Partner Name</TableHead>
            <TableHead className="whitespace-nowrap">Amount (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="whitespace-nowrap">Submitted On</TableHead>
            <TableHead>Remarks</TableHead>
            {/* <TableHead>Admin Remarks</TableHead> */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {isLoading ? (
          <CashSubmissionTableSkeleton rows={8} />
        ) : (
          <TableBody>
            {submissions.map((submission) => (
              <CashManagementRow
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
