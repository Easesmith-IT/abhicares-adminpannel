import { useEffect, useState } from "react";
import { format } from "date-fns";
import html2PDF from "jspdf-html2canvas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import useGetApiReq from "../../hooks/useGetApiReq";

const AllUsersModal = ({ setIsModalOpen }) => {
  const [allUsers, setAllUsers] = useState([]);
  const { res: getUsersDataRes, fetchData: getUsersData, isLoading } =
    useGetApiReq();

  /* ---------------- API ---------------- */

  const getAllUsers = async () => {
    getUsersData("/admin/get-users-data");
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (getUsersDataRes?.status === 200 || getUsersDataRes?.status === 201) {
      setAllUsers(getUsersDataRes?.data?.users || []);
    }
  }, [getUsersDataRes]);

  /* ---------------- DOWNLOAD ---------------- */

  const downloadUserData = () => {
    html2PDF(document.querySelector("#users-table"), {
      jsPDF: {
        format: "a4",
      },
      imageType: "image/jpeg",
      output: "./pdf/users.pdf",
    });
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Users</DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading && allUsers.length === 0 && (
          <div className="space-y-3 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && allUsers.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No users found
          </p>
        )}

        {/* Table */}
        {allUsers.length > 0 && (
          <>
            <div id="users-table" className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 border-b border-white/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Locality</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {allUsers.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {item?.userInfo?.name || "-"}
                      </TableCell>

                      <TableCell>{item?.userInfo?.phone || "-"}</TableCell>

                      <TableCell>
                        {item?.add
                          ? `${item.add.city}, ${item.add.pincode}`
                          : "No address found"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="abhicares" onClick={downloadUserData}>
                Download
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AllUsersModal;
