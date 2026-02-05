import { TableCell, TableRow } from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function CrashRow({ crash }) {
  const navigate = useNavigate();

  return (
    <TableRow className="border-b border-white/10 hover:bg-white/10 transition-colors">
      <TableCell>{crash.errorId || "-"}</TableCell>

      <TableCell>
        <SeverityBadge severity={crash.severity} />
      </TableCell>

      <TableCell>{crash.environment}</TableCell>

      <TableCell className="font-mono">
        <p className="w-40 truncate">{crash.errorName}</p>
        <div className="text-xs text-muted-foreground w-40 truncate">
          {crash.file}
        </div>
      </TableCell>

      <TableCell>{crash.source}</TableCell>

      <TableCell>{crash.userType || "-"}</TableCell>

      <TableCell>
        {crash.timeAgo}
        <div className="text-xs text-muted-foreground">{crash.timestamp}</div>
      </TableCell>

      <TableCell>{crash.status}</TableCell>

      <TableCell>
        <Button
          size="icon"
          variant="outline"
          className="bg-white/10 backdrop-blur-md hover:bg-white/20"
          onClick={() =>
            navigate(`/admin/crash-report/${crash.id}`, { state: crash })
          }
        >
          <EyeIcon className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

CrashRow.Skeleton = function CrashRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-full bg-black/10" />
      </TableCell>
    </TableRow>
  );
};
