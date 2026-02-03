import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpdateCashoutReqModal from "../modals/UpdateCashoutReqModal";


const CashOutReq = ({
  item,
  getSellerWallet,
  setIsViewWalletModalOpen,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const navigate = useNavigate();

  const statusVariant =
    item?.status === "completed"
      ? "success"
      : item?.status === "cancelled"
        ? "destructive"
        : "secondary";

  return (
    <>
      <Card className="border shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          {/* Left */}
          <div>
            <p className="text-sm font-medium">{item?.cashoutId}</p>
            <p className="text-xs text-muted-foreground">
              Date:{" "}
              {item?.createdAt &&
                format(new Date(item.createdAt), "dd-MM-yyyy")}
            </p>
          </div>

          {/* Middle */}
          <div className="text-center">
            <p className="text-lg font-semibold">₹ {item?.value}</p>
            <Badge variant={statusVariant} className="mt-1 capitalize">
              {item?.status}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                navigate(`/admin/seller-cashouts/${item?._id}`)
              }
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="abhicares"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {isUpdateModalOpen && (
        <UpdateCashoutReqModal
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          cashOutReq={item}
          getSellerWallet={getSellerWallet}
          setIsViewWalletModalOpen={setIsViewWalletModalOpen}
        />
      )}
    </>
  );
};

export default CashOutReq;
