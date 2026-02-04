import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import usePostApiReq from "../../hooks/usePostApiReq";
import { generateTimeOptions } from "../../utils/generateTimeOptions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SendNotificationModal = ({ setIsModalOpen, getNotifications }) => {
  const {
    res: sendNotificationRes,
    fetchData: sendNotification,
    isLoading: sendNotificationLoading,
  } = usePostApiReq();

  const [notificationInfo, setNotificationInfo] = useState({
    image: "",
    imagePrev: "",
    title: "",
    desc: "",
    timingType: "now",
    time: "",
    date: "",
    appType: "all",
  });

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNotificationInfo((prev) => ({
        ...prev,
        image: file,
        imagePrev: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOnChange = (name, value) => {
    setNotificationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!notificationInfo.title || !notificationInfo.desc) {
      toast.error("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", notificationInfo.title);
    formData.append("description", notificationInfo.desc);
    formData.append("date", notificationInfo.date);
    formData.append("time", notificationInfo.time);
    formData.append("image", notificationInfo.image);
    formData.append("appType", notificationInfo.appType);

    sendNotification("/admin/send-notification", formData);
  };

  useEffect(() => {
    if (
      sendNotificationRes?.status === 200 ||
      sendNotificationRes?.status === 201
    ) {
      toast.success("Notification sent successfully");
      getNotifications();
      setIsModalOpen(false);
    }
  }, [sendNotificationRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="space-y-5">
          {/* Image */}
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            {notificationInfo.imagePrev && (
              <img
                src={notificationInfo.imagePrev}
                alt="Preview"
                className="h-32 w-full rounded-md object-cover"
              />
            )}
            <Input type="file" accept="image/*" onChange={imageChangeHandler} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={notificationInfo.title}
              onChange={(e) => handleOnChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={notificationInfo.desc}
              onChange={(e) => handleOnChange("desc", e.target.value)}
            />
          </div>

          {/* App Type */}
          <div className="space-y-2">
            <Label>App Type</Label>
            <Select
              value={notificationInfo.appType}
              onValueChange={(value) => handleOnChange("appType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select app type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainApp">Main App</SelectItem>
                <SelectItem value="partnerApp">Partner App</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label>Timing</Label>
            <Select
              value={notificationInfo.timingType}
              onValueChange={(value) => handleOnChange("timingType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Send Now</SelectItem>
                <SelectItem value="select">Schedule</SelectItem>
              </SelectContent>
            </Select>

            {notificationInfo.timingType === "select" && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Input
                  type="date"
                  value={notificationInfo.date}
                  onChange={(e) => handleOnChange("date", e.target.value)}
                />
                <Input
                  type="time"
                  value={notificationInfo.time}
                  onChange={(e) => handleOnChange("time", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              variant="abhicares"
              type="submit"
              disabled={sendNotificationLoading}
            >
              {sendNotificationLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationModal;
