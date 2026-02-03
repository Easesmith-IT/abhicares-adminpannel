import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { useParams } from "react-router-dom";

import useGetApiReq from "../../hooks/useGetApiReq";

import Wrapper from "../../components/wrappers/Wrapper";
import UpdateCashoutReqModal from "../../components/modals/UpdateCashoutReqModal";
import WalletViewModal from "../../components/modals/WalletViewModal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SellerCashoutDetails = () => {
  const {
    res: getSellerCashoutRes,
    fetchData: getSellerCashout,
    isLoading: getSellerCashoutLoading,
  } = useGetApiReq();

  const { res: getRequestsRes, fetchData: getRequests } = useGetApiReq();

  const [state, setState] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [cashout, setCashout] = useState("");
  const [isViewWalletModalOpen, setIsViewWalletModalOpen] = useState(false);
  const [wallet, setWallet] = useState("");
  const [cashOutRequests, setCashOutRequests] = useState([]);

  const params = useParams();

  /* ---------------- API FUNCTIONS ---------------- */

  const getSingleCashout = async () => {
    getSellerCashout(
      `/admin/get-seller-cashout-detail?cashoutId=${params?.cashoutId}`,
    );
  };

  const getCashOutRequests = async (id) => {
    getRequests(`/admin/get-seller-wallet-recent-cashout-requests/${id}`);
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    getSingleCashout();
  }, []);

  useEffect(() => {
    if (
      getSellerCashoutRes?.status === 200 ||
      getSellerCashoutRes?.status === 201
    ) {
      const data = getSellerCashoutRes.data.cashout;
      setCashout(data);
      setState(data?.sellerWalletId?.sellerId);
      setWallet(data?.sellerWalletId);
      getCashOutRequests(data?.sellerWalletId?._id);
    }
  }, [getSellerCashoutRes]);

  useEffect(() => {
    if (getRequestsRes?.status === 200 || getRequestsRes?.status === 201) {
      setCashOutRequests(getRequestsRes.data.cashouts);
    }
  }, [getRequestsRes]);

  /* ---------------- RENDER ---------------- */

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* ================= Seller Info ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Info</CardTitle>
          </CardHeader>

          <CardContent>
            {getSellerCashoutLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <b>Name:</b> {state?.name}
                </p>
                <p>
                  <b>GST Number:</b> {state?.gstNumber}
                </p>
                <p>
                  <b>Phone:</b> {state?.phone}
                </p>
                <p>
                  <b>Legal Name:</b> {state?.legalName}
                </p>

                <p className="flex items-center gap-2">
                  <b>Status:</b>
                  <Badge
                    variant={
                      state?.status === "APPROVED"
                        ? "success"
                        : state?.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {state?.status}
                  </Badge>
                </p>

                <p className="col-span-2">
                  <b>Address:</b>{" "}
                  {`${state?.address?.addressLine}, ${state?.address?.city}, ${state?.address?.state}, ${state?.address?.pincode}`}
                </p>

                <p>
                  <b>Contact Person Name:</b> {state?.contactPerson?.name}
                </p>
                <p>
                  <b>Contact Person Phone:</b> {state?.contactPerson?.phone}
                </p>
                <p className="col-span-2">
                  <b>Contact Person Email:</b>{" "}
                  <span className="underline">
                    {state?.contactPerson?.email}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ================= Cashout + Wallet ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cashout Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cashout Details</CardTitle>
              <Button
                variant="abhicares"
                size="sm"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Update
              </Button>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p>
                <b>Cashout ID:</b> {cashout?.cashoutId}
              </p>
              <p>
                <b>Description:</b> {cashout?.description}
              </p>
              <p>
                <b>Status:</b>{" "}
                <Badge
                  variant={
                    cashout?.status === "completed"
                      ? "success"
                      : cashout?.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {cashout?.status}
                </Badge>
              </p>
              <p>
                <b>Amount:</b> ₹{cashout?.value}
              </p>
              <p>
                <b>Date:</b>{" "}
                {cashout?.createdAt &&
                  format(new Date(cashout.createdAt), "dd-MM-yyyy")}
              </p>
            </CardContent>
          </Card>

          {/* Wallet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-lg font-semibold">
                Balance: ₹{wallet?.balance || 0}
              </p>

              <Separator className="my-4" />

              {/* <Button
                variant="outline"
                onClick={() => setIsViewWalletModalOpen(true)}
              >
                View Wallet
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================= Modals ================= */}
      {isViewWalletModalOpen && (
        <WalletViewModal
          setIsViewWalletModalOpen={setIsViewWalletModalOpen}
          getSellerWallet={getSingleCashout}
          id={wallet?._id}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateCashoutReqModal
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          cashOutReq={cashout}
          getSellerWallet={getSingleCashout}
          setIsViewWalletModalOpen={setIsViewWalletModalOpen}
        />
      )}
    </Wrapper>
  );
};

export default SellerCashoutDetails;
