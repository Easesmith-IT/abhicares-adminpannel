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

const MonthlyOrderModal = ({isModalOpen, setIsModalOpen }) => {
  const {
    res: monthlyOrdersRes,
    fetchData: getMonthlyOrders,
    isLoading,
  } = usePostApiReq();

  const [dateYearInfo, setDateYearInfo] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState([]);

  const handleSubmit = () => {
    if (!dateYearInfo) return;

    const [year, month] = dateYearInfo.split("-");
    getMonthlyOrders("/admin/get-monthly-orders", { month, year });
  };

  const downloadInvoice = () => {
    html2PDF(document.querySelector("#monthly-orders-table"), {
      jsPDF: { format: "a4" },
      imageType: "image/jpeg",
      output: "./pdf/monthly-orders.pdf",
    });
  };

  useEffect(() => {
    if (monthlyOrdersRes?.status === 200 || monthlyOrdersRes?.status === 201) {
      setMonthlyOrders(monthlyOrdersRes.data.data);
    }
  }, [monthlyOrdersRes]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-5xl w-full">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Monthly Orders</DialogTitle>
          {/* <X
            className="cursor-pointer text-muted-foreground hover:text-black"
            onClick={() => setIsModalOpen(false)}
          /> */}
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          <input
            type="month"
            value={dateYearInfo}
            onChange={(e) => setDateYearInfo(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />

          <Button
            variant="abhicares"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>

        {/* Empty state */}
        {!isLoading && monthlyOrders.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No orders found for selected month.
          </p>
        )}

        {/* Table */}
        {monthlyOrders.length > 0 && (
          <>
            <div
              id="monthly-orders-table"
              className="max-h-[400px] overflow-auto rounded-md border"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 border-b border-white/40">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {monthlyOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.orderId}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>₹{order.orderValue}</TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "hh:mm a")}
                      </TableCell>
                      <TableCell>{order.user.name}</TableCell>
                      <TableCell>{order.user.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4">
              <Button variant="abhicares" onClick={downloadInvoice}>
                Download PDF
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyOrderModal;
