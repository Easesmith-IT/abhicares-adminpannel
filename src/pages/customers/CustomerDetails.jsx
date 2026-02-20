import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Wrapper from "../../components/wrappers/Wrapper";
import UserAddressModal from "../../components/modals/UserAddressModal";
import { PaginationComp } from "../../components/shared/PaginationComp";
import { Skeleton } from "../../components/ui/skeleton";
import { BookingTableSkeleton } from "../../components/customer/BookingTableSkeleton";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const CustomerDetails = () => {
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const { state: user } = useLocation();
  const navigate = useNavigate();

  const { res: getOrdersRes, fetchData: getOrders, isLoading } = useGetApiReq();

  const getAllOrders = () => {
    getOrders(`/admin/get-customer-bookings/${user?._id}?page=${page}`);
  };

  useEffect(() => {
    getAllOrders();
  }, [page]);

  useEffect(() => {
    if (getOrdersRes?.status === 200 || getOrdersRes?.status === 201) {
      setAllOrders(getOrdersRes?.data?.data || []);
      setPageCount(Number(getOrdersRes?.data?.pagination?.totalPages || 1));
    }
  }, [getOrdersRes]);

  const statusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-blue-600">{status}</Badge>;
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Customer Info */}
        <div
          className="flex justify-between
        "
        >
          <BackLink href={-1}>
            <H2>Customer Details</H2>
          </BackLink>
          <Button asChild variant="abhicares">
            <Link to={`/admin/customers/${user?._id}/wallet`}>Wallet Info</Link>
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle></CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsUserAddressModalOpen(true)}
            >
              View all address
            </Button>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-44" />
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold">Name:</span> {user?.name}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {user?.phone}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      user?.status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user?.status ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Joined Date:</span>{" "}
                  {user?.createdAt &&
                    format(new Date(user.createdAt), "dd/MM/yyyy")}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Bookings</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 border-b border-white/40">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <BookingTableSkeleton rows={6} />
                ) : allOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  allOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.bookingId}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>{statusBadge(order.status)}</TableCell>
                      <TableCell>₹{order?.itemTotalValue}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/admin/bookings/${order._id}`, {
                              state: order,
                            })
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <PaginationComp
              page={page}
              pageCount={pageCount}
              setPage={setPage}
              className="mt-8 mb-5"
            />
          </CardContent>
        </Card>
      </div>

      {isUserAddressModalOpen && (
        <UserAddressModal
          userId={user?._id}
          setIsModalOpen={setIsUserAddressModalOpen}
        />
      )}
    </Wrapper>
  );
};

export default CustomerDetails;
