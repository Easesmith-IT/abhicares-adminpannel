import { useEffect, useState } from "react";

import useGetApiReq from "@/hooks/useGetApiReq";
import { adaptCrashForList } from "../../components/crash-report/crashListAdapter";

import { CrashFilters } from "../../components/crash-report/CrashFilters";
import { CrashTable } from "../../components/crash-report/CrashTable";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { PageSizeSelect } from "../../components/shared/PageSizeSelect";
import { buildQuery } from "../../utils/buildQuery";
import Wrapper from "../../components/wrappers/Wrapper";
import { H2 } from "../../components/shared/typography";

const CrashReports = () => {
  const {
    res: getCrashReportsRes,
    fetchData: getCrashReports,
    isLoading,
  } = useGetApiReq();

  const [environment, setEnvironment] = useState("");
  const [severity, setSeverity] = useState("");
  const [userType, setUserType] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalCrashes, setTotalCrashes] = useState(0);
  const [crashReports, setCrashReports] = useState([]);

  const getAllCrashReports = async () => {
    const query = buildQuery({
      environment,
      severity,
      userType,
      page,
      limit,
    });

    getCrashReports(`/crash-report/get?${query}`);
  };

  /** Fetch on filters / page change */
  useEffect(() => {
    getAllCrashReports();
  }, [environment, severity, userType, page, limit]);

  /** Handle API response */
  useEffect(() => {
    if (
      getCrashReportsRes?.status === 200 ||
      getCrashReportsRes?.status === 201
    ) {
      const rawData = getCrashReportsRes?.data?.data || [];
      const meta = getCrashReportsRes?.data?.meta || {};

      setCrashReports(rawData.map(adaptCrashForList));
      setPageCount(meta.totalPages || 1);
      setTotalCrashes(meta.total || 0);
    }
  }, [getCrashReportsRes]);

  /** Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [environment, severity, userType]);

  return (
    <Wrapper>
      <div className="space-y-2">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <H2>Crash Reports</H2>
            <p className="text-sm text-muted-foreground">
              Total Crashes: <span className="font-mono">{totalCrashes}</span>
            </p>
          </div>
          <PageSizeSelect
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            label=""
          />
        </header>

        <div className="space-y-6">
          <CrashFilters
            environment={environment}
            setEnvironment={setEnvironment}
            severity={severity}
            setSeverity={setSeverity}
            userType={userType}
            setUserType={setUserType}
          />

          <CrashTable crashes={crashReports} isLoading={isLoading} />

          <div className="mt-8 mb-5 flex items-center justify-end gap-3">
            <PaginationComp
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CrashReports;
