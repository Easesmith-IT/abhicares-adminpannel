import { cn } from "../../lib/utils";

const DataNotFound = ({ name, className }) => {
  return (
    <div
      className={cn(
        "w-full text-center py-5 text-muted-foreground text-sm",
        className
      )}
    >
      {name} not found.
    </div>
  );
};

export default DataNotFound;
