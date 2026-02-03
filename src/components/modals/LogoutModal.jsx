import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertTriangle } from "lucide-react";

const LogoutModal = ({ isOpen, setIsLogoutModalOpen, handleLogout }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsLogoutModalOpen}>
      <AlertDialogContent className="max-w-[300px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Logout Confirmation
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-center gap-4">
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-700"
          >
            Yes
          </AlertDialogAction>

          <AlertDialogCancel className="bg-red-600 text-white hover:bg-red-700">
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
