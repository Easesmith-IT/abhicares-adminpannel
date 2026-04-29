import { format } from "date-fns";
import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Eye,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

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
import PartnerMetrics from "./PartnerMetrics";

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
    if (sellerRes?.status === 200) {
      setSeller(sellerRes.data.data);
      console.log("sellerRes", sellerRes);
    }
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

  console.log("walletRes", walletRes);

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
      // toast.success("Partner status updated");
      fetchSeller();
    }
  }, [updateStatusRes]);

  return (
    <>
      <Wrapper>
        <div className="space-y-6">
          <div className="flex justify-between gap-10 items-center">
            <BackLink href={-1}>
              <H2>Partner Details</H2>
            </BackLink>

            <div className="flex gap-5 items-center">
              <Button variant="abhicares" className="w-auto px-4">
                <Link
                  to={`/admin/partners/${partnerId}/cash-submission`}
                  state={{ walletId: wallet?._id }}
                >
                  Cash Submissions
                </Link>
              </Button>
              <Button variant="abhicares" className="w-auto px-4">
                <Link to={`/admin/partners/${partnerId}/offer-metrics`}>
                  Offer Metrics
                </Link>
              </Button>
              <Button variant="abhicares" className="w-auto px-4">
                <Link to={`/admin/partners/${partnerId}/offered-bookings`}>
                  Offered Bookings
                </Link>
              </Button>
            </div>
          </div>
          {/* ================= Partner Info ================= */}
          <Card>
            {/* <CardHeader>
              <CardTitle>Partner Info</CardTitle>
            </CardHeader> */}

            <CardContent>
              {sellerLoading || !seller ? (
                <PartnerInfoSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* ---------------- BASIC INFO ---------------- */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <b>Name:</b> {seller.name}
                    </p>
                    <p>
                      <b>Phone:</b> {seller.phone}
                    </p>
                    <p>
                      <b>Email:</b> {seller.email || "-"}
                    </p>
                    <p>
                      <b>Gender:</b> {seller.Gender}
                    </p>

                    <p>
                      <b>Legal Name:</b> {seller.legalName || "-"}
                    </p>
                    <p>
                      <b>GST:</b> {seller.gstNumber || "-"}
                    </p>

                    <p>
                      <b>Category:</b> {seller.categoryId?.name || "-"}
                    </p>

                    <p className="col-span-2">
                      <b>Services:</b>{" "}
                      {seller.services?.length
                        ? seller.services
                            .map((s) => s.serviceId?.name)
                            .join(", ")
                        : "-"}
                    </p>

                    <p>
                      <b>Status:</b> <Badge>{seller.status}</Badge>
                    </p>

                    <p>
                      <b>Joined:</b>{" "}
                      {format(new Date(seller.createdAt), "dd/MM/yyyy")}
                    </p>
                  </div>

                  {/* ---------------- ADDRESS ---------------- */}
                  <div className="text-sm">
                    <b>Address:</b>{" "}
                    {[
                      seller.address?.addressLine,
                      seller.address?.landmark,
                      seller.city?.cityName,
                      seller.city?.state,
                      seller.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>

                  {/* ---------------- CONTACT PERSON ---------------- */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <p>
                      <b>Contact Name:</b> {seller.contactPerson?.name || "-"}
                    </p>
                    <p>
                      <b>Contact Phone:</b> {seller.contactPerson?.phone || "-"}
                    </p>
                    <p>
                      <b>Contact Email:</b> {seller.contactPerson?.email || "-"}
                    </p>
                  </div>

                  {/* ---------------- BANK DETAILS ---------------- */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <b>Account No:</b>{" "}
                      {seller.bankDetails?.accountNumber || "-"}
                    </p>
                    <p>
                      <b>IFSC:</b> {seller.bankDetails?.ifscCode || "-"}
                    </p>
                    <p>
                      <b>Holder:</b>{" "}
                      {seller.bankDetails?.accountHolderName || "-"}
                    </p>
                    <p>
                      <b>Bank:</b> {seller.bankDetails?.bankName || "-"}
                    </p>
                  </div>

                  {/* ---------------- PROFILE PHOTO ---------------- */}
                  <div>
                    <h3 className="font-semibold mb-2">Profile Photo</h3>
                    {seller.profilePhoto?.url ? (
                      <img
                        src={`${import.meta.env.VITE_APP_IMAGE_URL}/${seller.profilePhoto.url}`}
                        className="h-32 w-32 object-cover rounded border"
                      />
                    ) : (
                      <p>No profile photo</p>
                    )}
                  </div>

                  {/* ---------------- DOCUMENTS ---------------- */}
                  <div>
                    <h3 className="font-semibold mb-3">Documents</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* PAN */}
                      {seller.documents?.panCard?.url && (
                        <DocCard
                          title="PAN Card"
                          file={seller.documents.panCard}
                        />
                      )}

                      {/* ADDRESS PROOF */}
                      {seller.documents?.addressProof?.url && (
                        <DocCard
                          title={`Address Proof (${seller.documents.addressProof.type})`}
                          file={seller.documents.addressProof}
                        />
                      )}

                      {/* GST */}
                      {seller.documents?.gstCertificate?.url && (
                        <DocCard
                          title="GST Certificate"
                          file={seller.documents.gstCertificate}
                        />
                      )}

                      {/* SHOP LICENSE */}
                      {seller.documents?.shopLicense?.url && (
                        <DocCard
                          title="Shop License"
                          file={seller.documents.shopLicense}
                        />
                      )}
                    </div>

                    {/* OTHER DOCUMENTS */}
                    {seller.documents?.otherDocuments?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Other Documents</h4>
                        <div className="flex flex-wrap gap-3">
                          {seller.documents.otherDocuments.map((doc, i) => (
                            <DocCard key={i} title={doc.name} file={doc} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <PartnerMetrics metrics={seller?.metrics} />

          {/* ================= Orders + Wallet ================= */}
          <div className="grid grid-cols-5 gap-6">
            {/* Orders */}
            <Card className="col-span-3">
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
            <Card className="col-span-2">
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
          getCashOutRequests={() => {
            fetchCashouts(wallet?._id);
            fetchWallet();
          }}
        />
      )}
    </>
  );
};

const DocCard = ({ title, file }) => {
  return (
    <div className="border rounded p-2 text-xs">
      <p className="mb-1 font-medium">{title}</p>

      <img
        src={`${import.meta.env.VITE_APP_IMAGE_URL}/${file.url}`}
        className="h-24 w-full object-cover rounded"
      />

      <p className="mt-1 text-xs">
        Status:{" "}
        <span className={file.verified ? "text-green-600" : "text-red-600"}>
          {file.verified ? "Verified" : "Not Verified"}
        </span>
      </p>
    </div>
  );
};

export default PartnerDetails;
