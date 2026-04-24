import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Wrench,
  IndianRupee,
  FileText,
  Eye,
  Clock,
} from "lucide-react";

import useGetApiReq from "../../hooks/useGetApiReq";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Wrapper from "../../components/wrappers/Wrapper";
import Timeline from "../../components/help-center/TimeLine";
import AddResoulationModal from "../../components/modals/AddResoulationModal";
import ServiceDetailsModal from "../../components/modals/ServiceDetailsModal";
import HelpCenterTicketDetailsSkeleton from "../../components/help-center/HelpCenterTicketDetailsSkeleton";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const HelpCenterTicketDetails = () => {
  const { ticketId } = useParams();
  const { res: getTicketRes, fetchData: getTicket } = useGetApiReq();

  const [ticketDetails, setTicketDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] =
    useState(false);

  const getTicketDetails = () => {
    getTicket(`/admin/get-single-ticket?ticketId=${ticketId}`);
  };

  console.log("ticketDetails", ticketDetails);
  

  useEffect(() => {
    getTicketDetails();
  }, []);

  useEffect(() => {
    if (getTicketRes?.status === 200 || getTicketRes?.status === 201) {
      setTicketDetails(getTicketRes?.data?.ticket);
    }
  }, [getTicketRes]);

  const history = (status) =>
    ticketDetails?.ticketHistory?.find((t) => t?.status === status);

  const userAddress = ticketDetails?.bookingId?.userAddress || {};
  const sellerAddress = ticketDetails?.sellerId?.address || {};

  return (
    <Wrapper>
      {!ticketDetails ? (
        <HelpCenterTicketDetailsSkeleton />
      ) : (
        <>
          <BackLink href={-1}>
            <H2>Ticket Details</H2>
          </BackLink>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 p-4">
            {/* LEFT */}
            <div className="lg:col-span-3 space-y-6">
              {/* Ticket Header */}
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Update Status</CardTitle>
                    {ticketDetails?.status !== "completed" && (
                      <Button
                        variant="abhicares"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{ticketDetails?.ticketId}</p>
                    <p>
                      {ticketDetails?.createdAt &&
                        format(
                          new Date(ticketDetails.createdAt),
                          "dd MMM yyyy, hh:mm aa",
                        )}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Raised By:</span>
                    {ticketDetails?.raisedBy === "customer"
                      ? ticketDetails?.userId?.name
                      : ticketDetails?.sellerId?.name}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {ticketDetails?.userId?.phone}
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p>
                      <span className="font-medium">Concern:</span>{" "}
                      {ticketDetails?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <User className="inline h-4 w-4 mr-2" />
                    {ticketDetails?.userId?.name}
                  </p>
                  <p>
                    <Phone className="inline h-4 w-4 mr-2" />
                    {ticketDetails?.userId?.phone}
                  </p>
                  <p>
                    <MapPin className="inline h-4 w-4 mr-2" />
                    {`${userAddress.addressLine}, ${userAddress.landmark}, ${userAddress.city}, ${userAddress.pincode}`}
                  </p>
                </CardContent>
              </Card>

              {/* Service Provider */}
              {ticketDetails?.sellerId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Service Provider</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <User className="inline h-4 w-4 mr-2" />
                      {ticketDetails?.sellerId?.name}
                    </p>
                    <p>
                      <Phone className="inline h-4 w-4 mr-2" />
                      {ticketDetails?.sellerId?.phone}
                    </p>
                    <p>
                      <MapPin className="inline h-4 w-4 mr-2" />
                      {`${sellerAddress.addressLine}, ${sellerAddress.city}, ${sellerAddress.state}, ${sellerAddress.pincode}`}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6 col-span-2">
              {/* Booking Details */}
              {ticketDetails?.bookingId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      <Badge variant="secondary">
                        {ticketDetails?.bookingId?.bookingId}
                      </Badge>
                    </p>

                    {ticketDetails?.serviceId && <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      {ticketDetails?.serviceId?.name}
                      {ticketDetails?.serviceId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsServiceDetailsModalOpen(true)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>}

                    <p>
                      <Clock className="inline h-4 w-4 mr-2" />
                      {ticketDetails?.bookingId?.bookingTime &&
                        format(
                          new Date(ticketDetails.bookingId.bookingTime),
                          "hh:mm aa",
                        )}
                    </p>

                    <p>
                      <MapPin className="inline h-4 w-4 mr-2" />
                      {ticketDetails?.bookingId?.userAddress?.addressLine}
                    </p>

                    <p>
                      <IndianRupee className="inline h-4 w-4 mr-2" />
                      {ticketDetails?.bookingId?.orderValue}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Timeline
                    title="Raised"
                    time={history("raised")?.date}
                    status={history("raised")?.status}
                    className={
                      history("raised") ? "bg-green-500" : "bg-gray-300"
                    }
                    desc={history("raised")?.resolution}
                  />
                  <Separator />
                  <Timeline
                    title="In Progress"
                    time={history("in-review")?.date}
                    status={history("in-review")?.status}
                    className={
                      history("in-review") ? "bg-green-500" : "bg-gray-300"
                    }
                    desc={history("in-review")?.resolution}
                  />
                  <Separator />
                  <Timeline
                    title="Completed"
                    time={history("completed")?.date}
                    status={history("completed")?.status}
                    className={
                      history("completed") ? "bg-green-500" : "bg-gray-300"
                    }
                    desc={history("completed")?.resolution}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {isModalOpen && (
            <AddResoulationModal
              setIsModalOpen={setIsModalOpen}
              getTicketDetails={getTicketDetails}
              id={ticketId}
            />
          )}

          {isServiceDetailsModalOpen && (
            <ServiceDetailsModal
              setIsModalOpen={setIsServiceDetailsModalOpen}
              service={ticketDetails?.serviceId}
            />
          )}
        </>
      )}
    </Wrapper>
  );
};

export default HelpCenterTicketDetails;
