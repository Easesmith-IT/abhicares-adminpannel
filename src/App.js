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
function App() {
  return (
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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/" exact element={<Dashboard />} />
        <Route path="/admin/partners" element={<Partners />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/payments" element={<Payments />} />

        <Route path="/admin/services/:categoryId" element={<CategoryServices />} />
        <Route path="/admin/services/:categoryId/product/:serviceId" element={<ServiceInfoPage />} />

        <Route path="/admin/offers" element={<Offers />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
