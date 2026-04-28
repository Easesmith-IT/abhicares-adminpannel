import React from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import {
  Calendar,
  Clock3,
  User,
  Phone,
  Store,
  FileText,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BackLink } from "../../components/shared/back-link";
import { H2, H3 } from "../../components/shared/typography";

const requestData = {
  requestId: "69efce4326f49a73085b2ebc",
  status: "pending",
  reason: "Medical emergency, cannot serve this slot",
  requestedAt: "2026-04-27T20:59:46.358Z",
  adminNote: null,
  booking: {
    bookingId: "BK10234",
    status: "alloted",
    bookingDate: "2026-04-28T08:30:00.000Z",
    bookingTime: "2026-04-28T08:30:00.000Z",
    currentLocation: {
      status: "booking-placed",
    },
    userId: {
      name: "Rahul Sharma",
      phone: "9876543210",
    },
  },
  seller: {
    name: "Vivek Seller",
    phone: "9988776655",
    status: "APPROVED",
  },
};

const badgeColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const RejectedBookingRequestDetails = () => {
  const { state } = useLocation();
  const data = state.requestData || "";
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-5">
          <div>
            <BackLink href={-1}>
              <H3>Rejected Booking Request Details</H3>
            </BackLink>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              badgeColors[data.status]
            }`}
          >
            {data.status}
          </span>
        </div>

        {/* Top grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Reject Request Details */}
          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="font-semibold text-lg mb-5">
              Reject Request Information
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Calendar size={18} />
                <div>
                  <p className="text-sm text-gray-500">Requested At</p>
                  <p className="font-medium">
                    {new Date(data.requestedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertTriangle size={18} />
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{data.reason}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={18} />
                <div>
                  <p className="text-sm text-gray-500">Booking Flow Status</p>
                  <p className="font-medium capitalize">
                    {data.booking.currentLocation.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="font-semibold text-lg mb-5">Seller Information</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Store size={18} />
                <div>
                  <p className="text-sm text-gray-500">Seller Name</p>
                  <p className="font-medium">{data.seller.name}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{data.seller.phone}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle size={18} />
                <div>
                  <p className="text-sm text-gray-500">Seller Status</p>
                  <p className="font-medium">{data.seller.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <h2 className="text-lg font-semibold mb-6">Booking Details</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex gap-">
                <FileText size={18} />
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <Link
                    className="hover:text-blue-700 hover:underline font-medium"
                    to={`/admin/bookings/${data?.booking?._id}`}
                  >
                    {data.booking.bookingId}
                  </Link>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar size={18} />
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium">
                    {new Date(data.booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock3 size={18} />
                <div>
                  <p className="text-sm text-gray-500">Booking Time</p>
                  <p className="font-medium">
                    {new Date(data.booking.bookingTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <AlertTriangle size={18} />
                <div>
                  <p className="text-sm text-gray-500">Booking Status</p>
                  <p className="font-medium capitalize">
                    {data.booking.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <User size={18} />
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium">{data.booking.userId.name}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} />
                <div>
                  <p className="text-sm text-gray-500">Customer Phone</p>
                  <p className="font-medium">{data.booking.userId.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default RejectedBookingRequestDetails;
