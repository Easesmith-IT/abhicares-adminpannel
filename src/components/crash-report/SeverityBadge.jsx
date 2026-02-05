import { Badge } from "@/components/ui/badge";

export function SeverityBadge({ severity  }) {
  const variant =
    severity === "CRITICAL"
      ? "destructive"
      : severity === "HIGH"
      ? "default"
      : "secondary";

  return <Badge variant={variant}>{severity}</Badge>;
}
