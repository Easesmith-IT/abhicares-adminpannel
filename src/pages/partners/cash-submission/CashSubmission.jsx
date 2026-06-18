import DatePicker from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import useGetApiReq from "@/hooks/useGetApiReq";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../../components/wrappers/Wrapper";
import SubmitCashModal from "./SubmitCashModal";
import { BackLink } from "../../../components/shared/back-link";
import { H2 } from "../../../components/shared/typography";
import { CashSubmissionTable } from "./CashSubmissionTable";
import { buildQuery } from "../../../utils/buildQuery";

const CashSubmission = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [submissionSummary, setSubmissionSummary] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("Monthly");

  // Optional (for Custom)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { res, fetchData, isLoading } = useGetApiReq();
  const { deliveryAgentId } = useParams();
  const { state } = useLocation();
  console.log("state", state);

  const getCashSubmissions = () => {
    if (range === "Custom" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates");
      return;
    }

    const query = buildQuery({
      range,
      page,
      deliveryPartnerId: deliveryAgentId,
      startDate: range === "Custom" ? startDate : null,
      endDate: range === "Custom" ? endDate : null,
    });

    fetchData(`/cashout/seller/${state.walletId}?${query}`);
  };

  useEffect(() => {
    getCashSubmissions();
  }, [page, range, startDate, endDate]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("getCashSubmissions res", res?.data);
      const { cashInHand, cashouts, totalSubmitted } = res?.data?.data;
      setSubmissions(cashouts);
      setSubmissionSummary({ cashInHand, totalSubmitted });
      // setPageCount(res?.data?.pagination?.totalPages);
    }
  }, [res]);

  return (
    <Wrapper>
      <div>
        <div className="flex justify-between gap-5 items-center">
          <BackLink href={-1}>
            <H2>Cash Submissions</H2>
          </BackLink>

          {/* <Button
            onClick={() => setIsModalOpen(true)}
            variant="abhicares"
            className="w-auto px-4"
          >
            Submit Cash
          </Button> */}
        </div>

        {isModalOpen && (
          <SubmitCashModal
            open={isModalOpen}
            onClose={() => setIsModalOpen((prev) => !prev)}
            getData={getCashSubmissions}
            state={state}
          />
        )}

        <div className="flex gap-2 mt-4">
          {/* {["Daily", "Weekly", "Monthly", "Custom"].map((r) => (
            <Button
              key={r}
              variant={range === r ? "abhicares" : "outline"}
              size="sm"
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))} */}

          {range === "Custom" && (
            <div className="flex gap-3 max-w-md">
              <DatePicker
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setEndDate(null); // reset end date if start changes
                }}
                placeholder="From date"
              />

              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="To date"
                disabled={(date) => date > new Date()}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 bg-white rounded-md gap-4 p-4 mt-6 h-24">
            <div className="rounded-md bg-muted animate-pulse h-full" />
            <div className="rounded-md bg-muted animate-pulse h-full" />
            <div className="rounded-md bg-muted animate-pulse h-full" />
            <div className="rounded-md bg-muted animate-pulse h-full" />
          </div>
        ) : (
          <div className="grid grid-cols-3 bg-white rounded-md gap-4 p-4 mt-6">
            <Metric
              label="Cash In Hand"
              value={submissionSummary?.cashInHand?.toFixed(2) || 0}
            />
            {/* <Metric
              label="Total Cash Earned"
              value={submissionSummary?.totalCashEarned || 0}
            /> */}
            <Metric
              label="Total Cash Submitted"
              value={submissionSummary?.totalSubmitted || 0}
            />
            {/* <Metric
              label="Pending Verification"
              value={submissionSummary?.pendingVerification || 0}
            /> */}
          </div>
        )}

        <CashSubmissionTable
          submissions={submissions}
          getCashSubmissions={getCashSubmissions}
          isLoading={isLoading}
          setPage={setPage}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </Wrapper>
  );
};

export default CashSubmission;

export const Metric = ({ label, value, negative = false }) => {
  const isNegative = negative && value !== 0;
  return (
    <div className="rounded-md border p-3 w-full">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`font-medium ${
          isNegative ? "text-destructive-foreground" : ""
        }`}
      >
        {isNegative ? `- ₹ ${Math.abs(value)}` : `₹ ${value}`}
      </p>
    </div>
  );
};
