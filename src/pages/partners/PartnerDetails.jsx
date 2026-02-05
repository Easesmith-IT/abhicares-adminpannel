import { format } from "date-fns";
import { Eye, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import AddCashoutReqModal from "../../components/modals/AddCashoutReqModal";
import SellerAssignedOrdersModal from "../../components/modals/SellerAssignedOrdersModal";
import SellerOrderInfoModal from "../../components/modals/SellerOrderInfoModal";
import WalletViewModal from "../../components/modals/WalletViewModal";
import CashOutReq from "../../components/partner/CashOutReq";
import {
  OrdersTableSkeleton,
  PartnerInfoSkeleton,
  WalletSkeleton,
} from "../../components/partner/Skeletons";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const PartnerDetails = () => {
  const { partnerId } = useParams();

  const {
    res: sellerRes,
    fetchData: getSeller,
    isLoading: sellerLoading,
  } = useGetApiReq();
  const {
    res: ordersRes,
    fetchData: getOrders,
    isLoading: ordersLoading,
  } = useGetApiReq();
  const {
    res: walletRes,
    fetchData: getWallet,
    isLoading: walletLoading,
  } = useGetApiReq();
  const { res: cashoutRes, fetchData: getCashouts } = useGetApiReq();
  const { res: updateStatusRes, fetchData: updateStatus } = usePostApiReq();

  const [seller, setSeller] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [cashouts, setCashouts] = useState([]);

  const [orderInfo, setOrderInfo] = useState(null);
  const [viewAllOrders, setViewAllOrders] = useState(false);
  const [viewWallet, setViewWallet] = useState(false);
  const [addCashout, setAddCashout] = useState(false);

  /* ---------------- API FUNCTIONS ---------------- */

  const fetchSeller = () =>
    partnerId && getSeller(`/admin/get-seller?sellerId=${partnerId}`);

  const fetchOrders = () =>
    partnerId && getOrders(`/admin/get-seller-order-list/${partnerId}`);

  const fetchWallet = () =>
    partnerId && getWallet(`/admin/get-seller-wallet/${partnerId}`);

  const fetchCashouts = (walletId) =>
    walletId &&
    getCashouts(`/admin/get-seller-wallet-recent-cashout-requests/${walletId}`);

  /* ---------------- INITIAL FETCH ---------------- */

  useEffect(() => {
    fetchSeller();
    fetchOrders();
    fetchWallet();
  }, [partnerId]);

  /* ---------------- RESPONSES ---------------- */

  useEffect(() => {
    if (sellerRes?.status === 200) setSeller(sellerRes.data.data);
  }, [sellerRes]);

  useEffect(() => {
    if (ordersRes?.status === 200) setOrders(ordersRes.data.sellerOrders);
  }, [ordersRes]);

  useEffect(() => {
    if (walletRes?.status === 200) {
      setWallet(walletRes.data.wallet);
      fetchCashouts(walletRes.data.wallet?._id);
    }
  }, [walletRes]);

  useEffect(() => {
    if (cashoutRes?.status === 200) setCashouts(cashoutRes.data.cashouts);
  }, [cashoutRes]);

  /* ---------------- STATUS UPDATE ---------------- */

  const handleStatusChange = (value) => {
    updateStatus("/admin/update-partner-status", {
      sellerId: partnerId,
      status: value,
    });
  };

  useEffect(() => {
    if (updateStatusRes?.status === 200) {
      toast.success("Partner status updated");
      fetchSeller();
    }
  }, [updateStatusRes]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6">
          <BackLink href={-1}>
            <H2>Partner Details</H2>
          </BackLink>
          {/* ================= Partner Info ================= */}
          <Card>
            {/* <CardHeader>
              <CardTitle>Partner Info</CardTitle>
            </CardHeader> */}

            <CardContent>
              {sellerLoading || !seller ? (
                <PartnerInfoSkeleton />
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <b>Name:</b> {seller.name}
                  </p>
                  <p>
                    <b>Joined:</b>{" "}
                    {format(new Date(seller.createdAt), "dd/MM/yyyy")}
                  </p>
                  <p>
                    <b>GST:</b> {seller.gstNumber}
                  </p>
                  <p>
                    <b>Phone:</b> {seller.phone}
                  </p>
                  <p>
                    <b>Legal Name:</b> {seller.legalName}
                  </p>

                  <div className="flex items-center gap-2">
                    <b>Status:</b>
                    <Badge>{seller.status}</Badge>
                    <Select
                      value={seller.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN-REVIEW">In Review</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="HOLD">Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p className="col-span-2">
                    <b>Address:</b>{" "}
                    {`${seller.address?.addressLine}, ${seller.address?.city}, ${seller.address?.state} - ${seller.address?.pincode}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ================= Orders + Wallet ================= */}
          <div className="grid grid-cols-3 gap-6">
            {/* Orders */}
            <Card className="col-span-2">
              <CardHeader className="flex justify-between">
                <CardTitle>Assigned Orders</CardTitle>
                <Button
                  variant="abhicares"
                  size="sm"
                  onClick={() => setViewAllOrders(true)}
                >
                  View All
                </Button>
              </CardHeader>

              <CardContent>
                {ordersLoading ? (
                  <OrdersTableSkeleton />
                ) : orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders found
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-200 border-b border-white/40">
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o._id}>
                          <TableCell>{o.bookingId}</TableCell>
                          <TableCell>₹{o.orderValue}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{o.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setOrderInfo(o)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Wallet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" /> Wallet
                </CardTitle>
              </CardHeader>

              <CardContent>
                {walletLoading ? (
                  <WalletSkeleton />
                ) : (
                  <>
                    <p className="text-lg font-semibold">
                      Balance: ₹{wallet?.balance || 0}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        onClick={() => setViewWallet(true)}
                      >
                        View History
                      </Button>
                      <Button
                        variant="abhicares"
                        onClick={() => setAddCashout(true)}
                      >
                        Add Cashout
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <ScrollArea className="h-48">
                      <div className="space-y-5 p-1">
                        {cashouts.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No cashout requests
                          </p>
                        ) : (
                          cashouts.map((c) => (
                            <CashOutReq
                              key={c._id}
                              item={c}
                              getSellerWallet={fetchWallet}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Wrapper>

      {/* ================= Modals ================= */}
      {orderInfo && (
        <SellerOrderInfoModal
          sellerOrder={orderInfo}
          setSellerOrderInfoModal={() => setOrderInfo(null)}
        />
      )}

      {viewAllOrders && (
        <SellerAssignedOrdersModal
          isSellerAssignedModalOpen={viewAllOrders}
          setIsSellerAssignedModalOpen={setViewAllOrders}
        />
      )}

      {viewWallet && (
        <WalletViewModal
          id={wallet?._id}
          setIsViewWalletModalOpen={setViewWallet}
          getSellerWallet={fetchWallet}
        />
      )}

      {addCashout && (
        <AddCashoutReqModal
          walletId={wallet?._id}
          setIsUpdateModalOpen={setAddCashout}
          getCashOutRequests={() => fetchCashouts(wallet?._id)}
        />
      )}
    </>
  );
};

export default PartnerDetails;
