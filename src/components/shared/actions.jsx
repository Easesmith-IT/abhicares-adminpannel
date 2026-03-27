import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export const Actions = ({
  children,
  onDelete,
  onEdit,
  onView,
  disabled = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button disabled={disabled} variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
