import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Section = ({ title, onAdd, children }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onAdd && (
        <Button variant="abhicares" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      )}
    </div>
    {children}
  </div>
);