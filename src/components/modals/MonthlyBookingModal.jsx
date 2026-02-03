import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import html2PDF from "jspdf-html2canvas";
import { useEffect, useState } from "react";
import usePostApiReq from "../../hooks/usePostApiReq";

const MonthlyBookingModal = ({ isModalOpen, setIsModalOpen }) => {
  const {
    res: monthlyBookingsRes,
    fetchData: getMonthlyBookings,
    isLoading,
  } = usePostApiReq();

  const [dateYearInfo, setDateYearInfo] = useState("");
  const [monthlyBookings, setMonthlyBookings] = useState([]);

  /* ================= Handlers ================= */

  const handleSubmit = () => {
    if (!dateYearInfo) return;

    const [year, month] = dateYearInfo.split("-");
    getMonthlyBookings("/admin/get-monthly-bookings", {
      month,
      year,
    });
  };

  const downloadInvoice = () => {
    html2PDF(document.querySelector("#monthly-bookings-table"), {
      jsPDF: { format: "a4" },
      imageType: "image/jpeg",
      output: "./pdf/monthly-bookings.pdf",
    });
  };

  /* ================= Effects ================= */

  useEffect(() => {
    if (
      monthlyBookingsRes?.status === 200 ||
      monthlyBookingsRes?.status === 201
    ) {
      setMonthlyBookings(monthlyBookingsRes.data.data);
    }
  }, [monthlyBookingsRes]);

  /* ================= UI ================= */

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full sm:max-w-6xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Monthly Bookings</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          <input
            type="month"
            value={dateYearInfo}
            onChange={(e) => setDateYearInfo(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />

          <Button variant="abhicares" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>

        {/* Empty State */}
        {!isLoading && monthlyBookings.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No bookings found for selected month.
          </p>
        )}

        {/* Table */}
        {monthlyBookings.length > 0 && (
          <>
            <div
              id="monthly-bookings-table"
              className="max-h-[420px] overflow-auto rounded-md border"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Booking Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {monthlyBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">
                        {booking.bookingId}
                      </TableCell>

                      <TableCell>
                        {format(new Date(booking.createdAt), "dd-MM-yyyy")}
                      </TableCell>

                      <TableCell>
                        {format(new Date(booking.bookingDate), "dd-MM-yyyy")}
                      </TableCell>

                      <TableCell>₹{booking.itemTotalValue}</TableCell>

                      <TableCell>
                        {booking.bookingTime
                          ? format(new Date(booking.bookingTime), "hh:mm a")
                          : "-"}
                      </TableCell>

                      <TableCell>{booking.userId?.name}</TableCell>
                      <TableCell>{booking.userId?.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4">
              <Button variant="abhicares" onClick={downloadInvoice}>Download PDF</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyBookingModal;
