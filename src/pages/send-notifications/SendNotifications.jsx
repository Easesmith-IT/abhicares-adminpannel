import { useEffect, useState } from "react";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import Wrapper from "../../components/wrappers/Wrapper";
import SendNotificationModal from "../../components/modals/SendNotificationModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { H2 } from "../../components/shared/typography";

const NotificationRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-48" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
  </TableRow>
);

const SendNotifications = () => {
  const {
    res: getAllNotificationsRes,
    fetchData: getAllNotifications,
    isLoading,
  } = useGetApiReq();

  const {
    res: searchNotificationRes,
    fetchData: searchNotification,
    isLoading: searchNotificationLoading,
  } = useGetApiReq();

  const {
    res: filterNotificationRes,
    fetchData: filterNotification,
    isLoading: filterNotificationLoading,
  } = useGetApiReq();

  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const handlePageClick = (page) => setPage(page);

  const getNotifications = async () => {
    getAllNotifications(`/admin/get-all-notifications?page=${page}`);
  };

  useEffect(() => {
    if (
      getAllNotificationsRes?.status === 200 ||
      getAllNotificationsRes?.status === 201
    ) {
      setNotifications(getAllNotificationsRes?.data?.data || []);
      setPageCount(getAllNotificationsRes?.data?.pagination?.totalPages || 1);
    }
  }, [getAllNotificationsRes]);

  const searchNotifications = async () => {
    searchNotification(`/admin/search-notifications?title=${searchTerm}`);
  };

  useEffect(() => {
    if (
      searchNotificationRes?.status === 200 ||
      searchNotificationRes?.status === 201
    ) {
      setNotifications(searchNotificationRes?.data?.data || []);
      setPageCount(searchNotificationRes?.data?.pagination?.totalPages || 1);
    }
  }, [searchNotificationRes]);

  const filterNotifications = async () => {
    filterNotification(
      `/admin/filter-notifications?date=${filterDate}&page=${page}`,
    );
  };

  useEffect(() => {
    if (
      filterNotificationRes?.status === 200 ||
      filterNotificationRes?.status === 201
    ) {
      setNotifications(filterNotificationRes?.data?.data || []);
      setPageCount(filterNotificationRes?.data?.pagination?.totalPages || 1);
    }
  }, [filterNotificationRes]);

  useEffect(() => {
    if (searchTerm) {
      searchNotifications();
    } else if (filterDate) {
      filterNotifications();
    } else {
      getNotifications();
    }
  }, [searchTerm, filterDate, page]);

  const isTableLoading =
    isLoading || searchNotificationLoading || filterNotificationLoading;

  return (
    <>
      <Wrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <H2>Notifications</H2>

            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Search notification"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[220px]"
              />

              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-[180px]"
              />

              <Button
                variant="abhicares"
                onClick={() => setIsSendNotificationModalOpen(true)}
              >
                Send Notification
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 border-b border-white/40">
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isTableLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <NotificationRowSkeleton key={i} />
                  ))}

                {!isTableLoading && notifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}

                {!isTableLoading &&
                  notifications.map((notification) => (
                    <TableRow key={notification._id}>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell className="max-w-[400px] truncate">
                        {notification.description}
                      </TableCell>
                      <TableCell>
                        {notification.createdAt
                          ? format(
                              new Date(notification.createdAt),
                              "dd-MM-yyyy",
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <PaginationComp
            page={page}
            pageCount={pageCount}
            setPage={setPage}
            className="mt-8 mb-5"
          />
        </div>
      </Wrapper>

      {isSendNotificationModalOpen && (
        <SendNotificationModal
          setIsModalOpen={setIsSendNotificationModalOpen}
          getNotifications={getNotifications}
        />
      )}
    </>
  );
};

export default SendNotifications;
