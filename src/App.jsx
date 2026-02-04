import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/protected-route/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/Dashboard";
import NotFound from "./pages/ErrorPage";
import OrderDetails from "./pages/orders/OrderDetails";
import Orders from "./pages/orders/Orders";
import Bookings from "./pages/bookings/Bookings";
import BookingDetails from "./pages/bookings/BookingDetails";
import Services from "./pages/services/Services";
import CategoryServices from "./pages/services/CategoryServices";
import ServiceInfoPage from "./pages/services/ServiceInfoPage";
import ProductInfo from "./pages/services/ProductInfo";
import Partners from "./pages/partners/Partners";
import PartnerDetails from "./pages/partners/PartnerDetails";
import SellerCashoutDetails from "./pages/partners/SellerCashoutDetails";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Offers from "./pages/offers/Offers";
import AvailableCities from "./pages/cities/AvailableCities";
import Payments from "./pages/payments/Payments";
import AdminHelpCenter from "./pages/help-center/HelpCenter";
import HelpCenterTicketDetails from "./pages/help-center/HelpCenterTicketDetails";
import Enquiry from "./pages/enquiry/Enquiry";
import Settings from "./pages/settings/Settings";
import MangageComision from "./pages/settings/MangageComision";
import Reviews from "./pages/reviews/Reviews";
import SendNotifications from "./pages/send-notifications/SendNotifications";
import SellerCashouts from "./pages/seller-cashouts/SellerCashouts";
import Banner from "./pages/banners/Banner";
import AppBanner from "./pages/banners/AppBanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" exact element={<AdminPage />} />

          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />

          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/bookings/:id" element={<BookingDetails />} />

          <Route path="/admin/services" element={<Services />} />
          <Route
            path="/admin/services/:categoryId"
            element={<CategoryServices />}
          />
          <Route
            path="/admin/services/:categoryId/product/:serviceId"
            element={<ServiceInfoPage />}
          />
          <Route
            path="/admin/services/:categoryId/product/:serviceId/info"
            element={<ProductInfo />}
          />

          <Route path="/admin/partners" element={<Partners />} />
          <Route
            path="/admin/partners/:partnerId"
            element={<PartnerDetails />}
          />
          
          <Route
            path="/admin/seller-cashouts/:cashoutId"
            element={<SellerCashoutDetails />}
          />

          <Route path="/admin/customers" element={<Customers />} />
          <Route
            path="/admin/customers/:customerId"
            element={<CustomerDetails />}
          />

          <Route path="/admin/offers" element={<Offers />} />

          <Route path="/admin/available-cities" element={<AvailableCities />} />

          <Route path="/admin/payments" element={<Payments />} />

          <Route path="/admin/help-center" element={<AdminHelpCenter />} />
          <Route
            path="/admin/help-center/tickets/:ticketId"
            element={<HelpCenterTicketDetails />}
          />

          <Route path="/admin/enquiries" element={<Enquiry />} />

          <Route path="/admin/settings" element={<Settings />} />
          <Route
            path="/admin/settings/manage-comision"
            element={<MangageComision />}
          />

          <Route path="/admin/reviews" element={<Reviews />} />

          <Route
            path="/admin/send-notifications"
            element={<SendNotifications />}
          />

          <Route path="/admin/seller-cashouts" element={<SellerCashouts />} />

          <Route path="/admin/banners" exact element={<Banner />} />
          <Route path="/admin/banners/app" exact element={<AppBanner />} />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
