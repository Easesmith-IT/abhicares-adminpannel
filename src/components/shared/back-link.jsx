import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const BackLink = ({ children, href }) => {
  const navigate = useNavigate();

  if (href === -1) {
    return (
      <div className="flex gap-2 items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon />
        </Button>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Button asChild variant="outline" size="icon" className="rounded-full cursor-pointer">
        <Link to={href}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <div>{children}</div>
    </div>
  );
};

