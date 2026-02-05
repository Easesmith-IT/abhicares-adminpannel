import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcwIcon } from "lucide-react";

export function CrashFilters({
  environment,
  setEnvironment,
  severity,
  setSeverity,
  userType,
  setUserType,
}) {
  const handleReset = () => {
    setEnvironment("");
    setSeverity("");
    setUserType("");
  };

  return (
    <div className="flex justify-end items-end gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Environment</label>
        <Select value={environment} onValueChange={setEnvironment}>
          <SelectTrigger>
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Severity</label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">User Type</label>
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger>
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Patient">Patient</SelectItem>
            <SelectItem value="Doctor">Doctor</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcwIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset Filters</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
