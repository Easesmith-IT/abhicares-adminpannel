import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const BackLink = ({ children, href }) => {
  return (
    <div className="flex gap-2 items-center">
      <Button asChild variant="outline" size="icon" className="rounded-full">
        <Link to={href}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <div>{children}</div>
    </div>
  );
};
