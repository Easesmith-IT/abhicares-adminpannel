import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/protected-route/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import AppBanner from "./pages/banners/AppBanner";
import Banner from "./pages/banners/Banner";
import BookingDetails from "./pages/bookings/BookingDetails";
import Bookings from "./pages/bookings/Bookings";
import AddCityPage from "./pages/cities/AddCity";
import AvailableCities from "./pages/cities/AvailableCities";
import UpdateCityPage from "./pages/cities/UpdateCity";
import CrashDetailPage from "./pages/crash-report/CrashDetailPage";
import CrashReports from "./pages/crash-report/CrashReport";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Customers from "./pages/customers/Customers";
import AdminPage from "./pages/Dashboard";
import Enquiry from "./pages/enquiry/Enquiry";
import NotFound from "./pages/ErrorPage";
import AdminHelpCenter from "./pages/help-center/HelpCenter";
import HelpCenterTicketDetails from "./pages/help-center/HelpCenterTicketDetails";
import Offers from "./pages/offers/Offers";
import OrderDetails from "./pages/orders/OrderDetails";
import Orders from "./pages/orders/Orders";
import PartnerDetails from "./pages/partners/PartnerDetails";
import Partners from "./pages/partners/Partners";
import SellerCashoutDetails from "./pages/partners/SellerCashoutDetails";
import Payments from "./pages/payments/Payments";
import Reviews from "./pages/reviews/Reviews";
import SellerCashouts from "./pages/seller-cashouts/SellerCashouts";
import SendNotifications from "./pages/send-notifications/SendNotifications";
import CategoryServices from "./pages/services/CategoryServices";
import ProductInfo from "./pages/services/ProductInfo";
import ServiceInfoPage from "./pages/services/ServiceInfoPage";
import Categories from "./pages/category/Categories";
import MangageComision from "./pages/settings/MangageComision";
import Settings from "./pages/settings/Settings";
import AddServicePage from "./pages/services/AddServicePage";
import UpdateServicePage from "./pages/services/UpdateServicePage";
import AddProductPage from "./pages/services/AddProductPage";
import UpdateProductPage from "./pages/services/UpdateProductPage";
import AddPackagePage from "./pages/services/AddPackagePage";
import UpdatePackagePage from "./pages/services/UpdatePackagePage";
import AddCategoryPage from "./pages/category/AddCategoryPage";
import UpdateCategoryPage from "./pages/category/UpdateCategoryPage";

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

          <Route path="/admin/categories" element={<Categories />} />
          <Route
            path="/admin/categories/add-category"
            element={<AddCategoryPage />}
          />
          <Route
            path="/admin/categories/:categoryId/update-category"
            element={<UpdateCategoryPage />}
          />
          <Route
            path="/admin/categories/:categoryId"
            element={<CategoryServices />}
          />
          <Route
            path="/admin/categories/:categoryId/add-service"
            element={<AddServicePage />}
          />
          <Route
            path="/admin/categories/:categoryId/update-service/:serviceId"
            element={<UpdateServicePage />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId"
            element={<ServiceInfoPage />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId/add-product"
            element={<AddProductPage />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId/update-product/:productId"
            element={<UpdateProductPage />}
          />

          <Route
            path="/admin/categories/:categoryId/product/:serviceId/add-package"
            element={<AddPackagePage />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId/update-package/:packageId"
            element={<UpdatePackagePage />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId/info/:productId"
            element={<ProductInfo />}
          />
          <Route
            path="/admin/categories/:categoryId/product/:serviceId/info"
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
          <Route path="/admin/available-cities/add" element={<AddCityPage />} />
          <Route
            path="/admin/available-cities/:cityId/update"
            element={<UpdateCityPage />}
          />

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

          <Route path="/admin/crash-report" exact element={<CrashReports />} />
          <Route
            path="/admin/crash-report/:crashId"
            exact
            element={<CrashDetailPage />}
          />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
