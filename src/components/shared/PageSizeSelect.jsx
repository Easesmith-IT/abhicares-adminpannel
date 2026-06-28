import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PAGE_SIZE_OPTIONS = ["10", "15", "25", "50"];

export function PageSizeSelect({
  value = "10",
  onChange,
  className,
  triggerClassName,
  label = "Show",
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label ? (
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
          {label}
        </span>
      ) : null}

      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-9 w-[88px] bg-white border-slate-200 text-xs",
            triggerClassName,
          )}
        >
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
