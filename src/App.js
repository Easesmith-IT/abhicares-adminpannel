import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Error from "./pages/ErrorPage";

import Dashboard from "./pages/AdminPanel/Dashboard";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import CategoryDetails from "./components/CategoryPage/CategoryDetails";
import CartPage from "./components/Cart/CartPage";
import Login from "./pages/Login";
import Partners from "./pages/AdminPanel/Partners";
import Customers from "./pages/AdminPanel/Customers";
import Services from "./pages/AdminPanel/Services";
import Payments from "./pages/AdminPanel/Payments";
import Offers from "./pages/AdminPanel/Offers";
import AdminLogin from "./pages/AdminPanel/AdminLogin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route
          path="/:categoryId/categories"
          element={<CategoryPage />}
          exact
        />
        <Route
          path="/:categoryId/categories/:serviceId/details"
          element={<CategoryDetails />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/partners" element={<Partners />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/payments" element={<Payments />} />

        <Route path="/admin/offers" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
