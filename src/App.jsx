import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AnnouncementForm from "./components/banner/announcement/AnnouncementFrom";
import PrivateRoute from "./components/protected-route/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import AppBanner from "./pages/banners/AppBanner";
import Banners from "./pages/banners/Banners";
import CreateBanner from "./pages/banners/CreateBanner";
import UpdateBanner from "./pages/banners/UpdateBanner";
import BookingDetails from "./pages/bookings/BookingDetails";
import Bookings from "./pages/bookings/Bookings";
import CashManagement from "./pages/cash-management/CashManagement";
import AddCategoryPage from "./pages/category/AddCategoryPage";
import Categories from "./pages/category/Categories";
import UpdateCategoryPage from "./pages/category/UpdateCategoryPage";
import AddCityPage from "./pages/cities/AddCity";
import AvailableCities from "./pages/cities/AvailableCities";
import UpdateCityPage from "./pages/cities/UpdateCity";
import CrashDetailPage from "./pages/crash-report/CrashDetailPage";
import CrashReports from "./pages/crash-report/CrashReport";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CustomerRewardPoints from "./pages/customers/CustomerRewardPoints";
import Customers from "./pages/customers/Customers";
import CustomerWallet from "./pages/customers/CustomerWallet";
import AdminPage from "./pages/Dashboard";
import Enquiry from "./pages/enquiry/Enquiry";
import NotFound from "./pages/ErrorPage";
import Globals from "./pages/globals/Globals";
import AdminHelpCenter from "./pages/help-center/HelpCenter";
import HelpCenterTicketDetails from "./pages/help-center/HelpCenterTicketDetails";
import AddItemCategory from "./pages/item-category/AddItemCategory";
import CategoryDetailsPage from "./pages/item-category/CategoryDetailsPage";
import ItemCategories from "./pages/item-category/ItemCategory";
import EditCategoryPage from "./pages/item-category/UpdateItemCategory";
import CampaignDetail from "./pages/notifications/CampaignDetail";
import CampaignList from "./pages/notifications/CampaignList";
import CreateCampaign from "./pages/notifications/CreateCampaign";
import EditCampaign from "./pages/notifications/EditCampaign";
import CreateOffer from "./pages/offers/CreateOffer";
import OfferDetail from "./pages/offers/OfferDetails";
import Offers from "./pages/offers/Offers";
import UpdateOffer from "./pages/offers/UpdateOffer";
import OrderDetails from "./pages/orders/OrderDetails";
import Orders from "./pages/orders/Orders";
import CashSubmission from "./pages/partners/cash-submission/CashSubmission";
import CreateSeller from "./pages/partners/CreatePartner";
import PartnerDetails from "./pages/partners/PartnerDetails";
import Partners from "./pages/partners/Partners";
import SellerCashoutDetails from "./pages/partners/SellerCashoutDetails";
import UpdateSeller from "./pages/partners/UpdatePartner";
import Payments from "./pages/payments/Payments";
import Reviews from "./pages/reviews/Reviews";
import SellerCashouts from "./pages/seller-cashouts/SellerCashouts";
import AddPackagePage from "./pages/services/AddPackagePage";
import AddProductPage from "./pages/services/AddProductPage";
import AddServicePage from "./pages/services/AddServicePage";
import CategoryServices from "./pages/services/CategoryServices";
import PackageInfo from "./pages/services/PackageInfo";
import ProductInfo from "./pages/services/ProductInfo";
import ServiceInfoPage from "./pages/services/ServiceInfoPage";
import UpdatePackagePage from "./pages/services/UpdatePackagePage";
import UpdateProductPage from "./pages/services/UpdateProductPage";
import UpdateServicePage from "./pages/services/UpdateServicePage";
import Settings from "./pages/settings/Settings";
// import PackageInfo from "./pages/services/PackageInfo";

function App() {
  return (
    <Router>
      <Toaster />
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
            path="/admin/categories/:categoryId/package/:serviceId/info/:packageId"
            element={<PackageInfo />}
          />
          {/* <Route
            path="/admin/categories/:categoryId/product/:serviceId/info"
            element={<ProductInfo />}
          /> */}

          <Route path="/admin/partners" element={<Partners />} />
          <Route path="/admin/partners/create" element={<CreateSeller />} />
          <Route
            path="/admin/partners/:partnerId/update"
            element={<UpdateSeller />}
          />
          <Route
            path="/admin/partners/:partnerId"
            element={<PartnerDetails />}
          />
          <Route
            path="/admin/partners/:partnerId/cash-submission"
            element={<CashSubmission />}
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
          <Route
            path="/admin/customers/:customerId/reward-points"
            element={<CustomerRewardPoints />}
          />
          <Route
            path="/admin/customers/:customerId/wallet"
            element={<CustomerWallet />}
          />

          <Route path="/admin/offers" element={<Offers />} />
          <Route path="/admin/offers/:offerId" element={<OfferDetail />} />
          <Route path="/admin/offers/create" element={<CreateOffer />} />
          <Route
            path="/admin/offers/:offerId/update"
            element={<UpdateOffer />}
          />

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

          <Route path="/admin/reviews" element={<Reviews />} />

          {/* <Route
            path="/admin/send-notifications"
            element={<SendNotifications />}
          /> */}

          <Route path="/admin/seller-cashouts" element={<SellerCashouts />} />

          <Route path="/admin/banners" exact element={<Banners />} />
          <Route
            path="/admin/banner/add-announcement"
            exact
            element={<AnnouncementForm />}
          />
          <Route
            path="/admin/banner/update-announcement"
            exact
            element={<AnnouncementForm />}
          />
          <Route
            path="/admin/banners/create"
            exact
            element={<CreateBanner />}
          />
          <Route
            path="/admin/banners/:id/update"
            exact
            element={<UpdateBanner />}
          />
          <Route path="/admin/banners/app" exact element={<AppBanner />} />

          <Route path="/admin/crash-report" exact element={<CrashReports />} />
          <Route
            path="/admin/crash-report/:crashId"
            exact
            element={<CrashDetailPage />}
          />

          <Route path="/admin/globals" exact element={<Globals />} />
          <Route path="/admin/notifications" exact element={<CampaignList />} />
          <Route
            path="/admin/notifications/create"
            exact
            element={<CreateCampaign />}
          />
          <Route
            path="/admin/notifications/:id/edit"
            exact
            element={<EditCampaign />}
          />
          <Route
            path="/admin/notifications/:id"
            exact
            element={<CampaignDetail />}
          />
          <Route
            path="/admin/cash-management"
            exact
            element={<CashManagement />}
          />
          <Route
            path="/admin/item-categories"
            exact
            element={<ItemCategories />}
          />
          <Route
            path="/admin/item-categories/add"
            exact
            element={<AddItemCategory />}
          />
          <Route
            path="/admin/item-categories/:categoryId"
            exact
            element={<CategoryDetailsPage />}
          />
          <Route
            path="/admin/item-categories/:categoryId/update"
            exact
            element={<EditCategoryPage />}
          />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
