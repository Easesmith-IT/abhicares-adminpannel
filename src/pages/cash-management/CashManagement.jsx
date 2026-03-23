import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CityFilter from "../../components/filters/city/CityFilter";
import useCities from "../../components/filters/city/useCities";
import { H2 } from "../../components/shared/typography";
import Wrapper from "../../components/wrappers/Wrapper";
import useGetApiReq from "../../hooks/useGetApiReq";
import { buildQuery } from "../../utils/buildQuery";
import { CashSubmissionTable } from "../partners/cash-submission/CashSubmissionTable";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { EyeIcon } from "lucide-react";
import { CashManagementTable } from "../partners/cash-submission/CashManagementTable";
import TooltipIconButton from "../../components/shared/TooltipIconButton";
import { Skeleton } from "../../components/ui/skeleton";

const sampleData = [
  {
    partnerId: "P001",
    cashInHand: 5235,
    name: "Partner 1",
  },
  {
    partnerId: "P002",
    cashInHand: 1200,
    name: "Partner 2",
  },
];

const CashManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState("Monthly");
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);

  const { res, fetchData, isLoading } = useGetApiReq();
  const {
    res: res2,
    fetchData: fetchData2,
    isLoading: isLoading2,
  } = useGetApiReq();
  const { cities } = useCities();

  const handleReset = () => {
    setSelectedCity("");
  };

  const getCashSubmissions = () => {
    if (range === "Custom" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates");
      return;
    }

    const query = buildQuery({
      range,
      page,
      city:selectedCity || "",
    });

    fetchData(
      `/cashout/get-cash-submission?${query}`,
    );
  };

  useEffect(() => {
    getCashSubmissions();
  }, [page, range, selectedCity]);

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("getCashSubmissions res", res?.data);
      setSubmissions(res?.data?.data);
    }
  }, [res]);

  const getCashInHandOfSellers = () => {
    fetchData2(`/cashout/partners-cash-in-hand?city=${selectedCity || ""}`);
  };

  useEffect(() => {
    getCashInHandOfSellers();
  }, [selectedCity]);
  console.log("selectedCity", selectedCity);

  useEffect(() => {
    if (res2?.status === 200 || res2?.status === 201) {
      console.log("getCashInHandOfSellers res", res2);
      setSellers(res2?.data?.data);
    }
  }, [res2]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-5">
          <H2>Cash Management</H2>
          <div className="flex gap-5 items-center">
            <CityFilter
              cities={cities}
              value={selectedCity}
              onChange={setSelectedCity}
            />
            <TooltipIconButton tooltip="Reset Filters" onClick={handleReset} />
          </div>
        </div>
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-md grid-cols-2">
            <TabsTrigger value="submissions">Cash Submissions</TabsTrigger>
            <TabsTrigger value="partners">Partner Cash</TabsTrigger>
          </TabsList>

          {/* 🔹 Tab 1: Cash Submission Table */}
          <TabsContent value="submissions">
            <CashManagementTable
              submissions={submissions}
              getCashSubmissions={getCashSubmissions}
              isLoading={isLoading}
              setPage={setPage}
              page={page}
              pageCount={pageCount}
            />
          </TabsContent>

          {/* 🔹 Tab 2: Partner Cash Table */}
          <TabsContent value="partners">
            <div className="table-container mt-10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 border-b border-white/40">
                    <TableHead>Partner ID</TableHead>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Cash In Hand</TableHead>
                    {/* <TableHead>Total Cash Submitted</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading2 && (
                    <TableRow>
                      <TableCell>
                        <Skeleton className="w-full h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full h-5" />
                      </TableCell>
                    </TableRow>
                  )}
                  {sellers.map((partner) => (
                    <TableRow
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/partners/${partner.sellerId}`)
                      }
                      key={partner.sellerId}
                    >
                      <TableCell className="font-medium">
                        {partner.partnerId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partner.name}
                      </TableCell>

                      <TableCell className="text-green-600 font-semibold">
                        ₹ {partner.cashInHand.toFixed(2)}
                      </TableCell>

                      {/* <TableCell className="text-blue-600 font-semibold">
                        ₹ {partner.totalSubmitted.toFixed(2)}
                      </TableCell> */}
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/admin/partners/${partner.sellerId}`)
                          }
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {sellers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
};

export default CashManagement;
