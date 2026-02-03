import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import useGetApiReq from "../../hooks/useGetApiReq";
import CashOutReq from "../partner/CashOutReq";
import { Spinner } from "../ui/spinner";

const WalletViewModal = ({
  setIsViewWalletModalOpen,
  id,
  getSellerWallet,
}) => {
  const { res, fetchData, isLoading } = useGetApiReq();

  const [cashOutRequests, setCashOutRequests] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  /* ---------------- API FUNCTIONS ---------------- */

  const fetchCashOutRequests = () => {
    if (!id) return;
    fetchData(
      `/admin/get-seller-wallet-cashout-requests/${id}?startDate=${filters.startDate}&endDate=${filters.endDate}`
    );
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchCashOutRequests();
  }, [filters.startDate, filters.endDate, id]);

  useEffect(() => {
    if (res?.status === 200) {
      setCashOutRequests(res.data.cashouts);
    }
  }, [res]);

  return (
    <Dialog open onOpenChange={setIsViewWalletModalOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Wallet</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Start Date</p>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  startDate: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">End Date</p>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  endDate: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <Separator />

        {/* Content */}
        {isLoading && cashOutRequests.length === 0 ? (
          <Spinner />
        ) : cashOutRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            No cashout requests found
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-3">
              {cashOutRequests.map((item) => (
                <CashOutReq
                  key={item._id}
                  item={item}
                  getSellerWallet={getSellerWallet}
                  setIsViewWalletModalOpen={setIsViewWalletModalOpen}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WalletViewModal;
