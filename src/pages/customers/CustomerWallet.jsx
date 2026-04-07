import React, { useEffect, useState } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";
import WalletCreditModal from "../../components/customer/WalletCreditModal";
import { Button } from "../../components/ui/button";
import WalletBalanceCard from "../../components/customer/WalletBalanceCard";
import { useParams } from "react-router-dom";
import useGetApiReq from "../../hooks/useGetApiReq";

const CustomerWallet = () => {
  const [isCreditWalletModalOpen, setIsCreditWalletModalOpen] = useState(false);
  const params = useParams();

  const handleOpen = () => {
    setIsCreditWalletModalOpen((prev) => !prev);
  };

  // const getWalletInfo = () => {};
  const { res, isLoading, fetchData } = useGetApiReq();

  const getWalletInfo = async () => {
    await fetchData("/userWallet/balance", {
      params: { userId: params?.customerId },
      screenName: "WalletBalanceCard",
    });
  };

  useEffect(() => {
    getWalletInfo();
  }, [params?.customerId]);

  const wallet = res?.data?.data;

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-5">
          <BackLink href={-1}>
            <H2>Customer Wallet Details</H2>
          </BackLink>
          <Button onClick={handleOpen} variant="abhicares">
            Credit
          </Button>
        </div>

        <WalletBalanceCard
          wallet={wallet}
          getWalletInfo={getWalletInfo}
          isLoading={isLoading}
        />

        {isCreditWalletModalOpen && (
          <WalletCreditModal
            open={isCreditWalletModalOpen}
            onOpenChange={handleOpen}
            onSuccess={getWalletInfo}
            userId={params?.customerId}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default CustomerWallet;
