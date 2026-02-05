import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataNotFound from "../shared/DataNotFound";
import { CrashRow } from "./CrashRow";



export function CrashTable({ crashes, isLoading }) {
  return (
    <div className="glass p-3">
      <Table>
        <TableHeader>
          {/* <TableRow className="bg-white/5 backdrop-blur-md"> */}
          <TableRow className="bg-slate-200 border-b border-white/40">
            <TableHead>Error Id</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {crashes.map((crash) => (
            <CrashRow key={crash.id} crash={crash} />
          ))}

          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <CrashRow.Skeleton key={index} />
            ))}
        </TableBody>
      </Table>

      {crashes.length === 0 && !isLoading && (
        <DataNotFound name="Crash Reports" />
      )}
    </div>
  );
}
