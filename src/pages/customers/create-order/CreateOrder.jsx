import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Wrapper from "../../../components/wrappers/Wrapper";
import { BackLink } from "../../../components/shared/back-link";
import { H2 } from "../../../components/shared/typography";
import Stepper from "../../../components/customer/create-order/Stepper";
import { Button } from "../../../components/ui/button";
import CartSheet from "../../../components/customer/create-order/Cart";
import { ShoppingCartIcon } from "lucide-react";

import Categories from "../../../components/customer/create-order/Categories";
import Services from "../../../components/customer/create-order/Services";
import ProductsAndPackages from "../../../components/customer/create-order/ProductsAndPackages";
import Checkout from "../../../components/customer/create-order/Checkout";

const routeToStep = {
  "/categories": 1,
  "/services": 2,
  "/products": 3,
  "/checkout": 4,
};

const stepToRoute = ["categories", "services", "products", "checkout"];

const CreateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

 const path = location.pathname;

 let step = 1;

 if (path.includes("/checkout")) {
   step = 4;
 } else if (path.includes("/products")) {
   step = 3;
 } else if (path.includes("/services")) {
   step = 2;
 } else {
   step = 1;
 }

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-5 items-center justify-between">
          <BackLink href={-1}>
            <H2>Create Order</H2>
          </BackLink>

          <Button variant="abhicares" onClick={() => setIsCartSheetOpen(true)}>
            <ShoppingCartIcon />
          </Button>
        </div>

        {/* Stepper */}
        <Stepper currentStep={step} onStepClick={() => {}} />

        {/* ✅ ROUTES MUST BE HERE */}
        <div className="mt-8">
          <Routes>
            <Route path="/" element={<Categories />} />
            <Route path="categories" element={<Categories />} />
            <Route
              path="categories/:categoryId/services"
              element={<Services />}
            />
            <Route
              path="categories/:categoryId/services/:serviceId/products"
              element={<ProductsAndPackages />}
            />
            <Route path="checkout" element={<Checkout />} />
          </Routes>
        </div>

        {/* Navigation */}
        {/* <div className="mt-6 flex gap-4">
          <button
            disabled={step === 1}
            onClick={() => goToStep(step - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Back
          </button>

          <button
            disabled={step === 4}
            onClick={() => goToStep(step + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div> */}

        <CartSheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen} />
      </div>
    </Wrapper>
  );
};

export default CreateOrder;
