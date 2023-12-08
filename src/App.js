import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "./pages/ErrorPage";

import Dashboard from "./pages/AdminPanel/Dashboard";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import CategoryDetails from "./components/CategoryPage/CategoryDetails";
import Partners from "./pages/AdminPanel/Partners";
import Customers from "./pages/AdminPanel/Customers";
import Services from "./pages/AdminPanel/Services";
import CategoryServices from "./pages/CategoryServices/CategoryServices";
import Payments from "./pages/AdminPanel/Payments";
import Offers from "./pages/AdminPanel/Offers";
import AdminLogin from "./pages/AdminPanel/AdminLogin";
import ServiceInfoPage from "./pages/serviceInfoPage/ServiceInfoPage";

import { Toaster } from 'react-hot-toast';
import Enquiry from "./pages/AdminPanel/Inquiry";
import Banner from "./pages/AdminPanel/Banners/Banner";
import AppBanner from "./pages/AdminPanel/Banners/AppBanner";
import WebsiteBanner from "./pages/AdminPanel/Banners/WebsiteBanner";
import Home from "./pages/AdminPanel/Banners/App/Home";
import Category from "./pages/AdminPanel/Banners/App/Category";
import Service from "./pages/AdminPanel/Banners/App/Service";
import Product from "./pages/AdminPanel/Banners/App/Product";
import Cms from "./pages/AdminPanel/cms/Cms";
import PrivacyPolicy from "./pages/AdminPanel/cms/privacy-policy/PrivacyPolicy";
import AboutUs from "./pages/AdminPanel/cms/about-us/AboutUs";
import ContactUs from "./pages/AdminPanel/cms/contact-us/ContactUs";
import Bookings from "./pages/AdminPanel/bookings/Bookings";
import BookingDetails from "./pages/AdminPanel/bookingDetails/BookingDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/:categoryId/categories"
            element={<CategoryPage />}
            exact
          />
          <Route
            path="/:categoryId/categories/:serviceId/details"
            element={<CategoryDetails />}
          />
          <Route path="/" element={<AdminLogin />} />
          <Route path="/admin/dashboard" exact element={<Dashboard />} />

          <Route path="/admin/banners" exact element={<Banner />} />
          <Route path="/admin/banners/app" exact element={<AppBanner />} />
          <Route path="/admin/banners/app/home" exact element={<Home />} />
          <Route path="/admin/banners/app/category" exact element={<Category />} />
          <Route path="/admin/banners/app/service" exact element={<Service />} />
          <Route path="/admin/banners/app/product" exact element={<Product />} />


          <Route path="/admin/cms" exact element={<Cms />} />
          <Route path="/admin/cms/privacy-policy" exact element={<PrivacyPolicy />} />
          <Route path="/admin/cms/about-us" exact element={<AboutUs />} />
          <Route path="/admin/cms/contact-us" exact element={<ContactUs />} />


          <Route
            path="/admin/banners/website"
            exact
            element={<WebsiteBanner />}
          />

          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/bookings/:id" element={<BookingDetails />} />


          <Route path="/admin/partners" element={<Partners />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/services" element={<Services />} />
          <Route path="/admin/payments" element={<Payments />} />

          <Route
            path="/admin/services/:categoryId"
            element={<CategoryServices />}
          />
          <Route
            path="/admin/services/:categoryId/product/:serviceId"
            element={<ServiceInfoPage />}
          />

          <Route path="/admin/enquiries" element={<Enquiry />} />
          <Route path="/admin/offers" element={<Offers />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
