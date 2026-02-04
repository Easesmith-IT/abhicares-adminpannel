import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useAuthorization from "../../hooks/useAuthorization";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { Textarea } from "../ui/textarea";

const AddResoulationModal = ({ setIsModalOpen, id, getTicketDetails }) => {
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [resoulationInfo, setResoulationInfo] = useState({
    status: "",
    resolution: "",
    ticketId: id,
    date: "",
  });

  const { checkAuthorization } = useAuthorization();
  const navigate = useNavigate();

  const { res: addResoulationRes, fetchData: addResoulationFetchData } =
    usePatchApiReq();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setResoulationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!resoulationInfo.resolution || !resoulationInfo.status) return;

    await addResoulationFetchData("/admin/update-ticket", {
      ...resoulationInfo,
    });
  };

  useEffect(() => {
    if (
      addResoulationRes?.status === 200 ||
      addResoulationRes?.status === 201
    ) {
    //   toast.success("Ticket updated successfully");
      getTicketDetails();
      setIsModalOpen(false);
    }
  }, [addResoulationRes]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add Resolution</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="space-y-5 mt-4">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={resoulationInfo.status}
              onValueChange={(value) =>
                setResoulationInfo((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raised">Raised</SelectItem>
                <SelectItem value="in-review">In review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              name="resolution"
              value={resoulationInfo.resolution}
              onChange={handleOnChange}
              className="resize-none"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={resoulationInfo.date}
              onChange={handleOnChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="abhicares" type="submit">Resolve</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResoulationModal;
