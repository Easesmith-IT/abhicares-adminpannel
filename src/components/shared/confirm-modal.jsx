"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export const ConfirmModal = ({
  children,
  header = "Delete",
  description = "This will delete the item and all of its contents.",
  onConfirm = () => {},
  disabled,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{header}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            // className="bg-destructive hover:bg-destructive/90"
            variant="destructive"
            disabled={disabled}
            onClick={handleConfirm}
          >
            {disabled ? <Spinner /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
