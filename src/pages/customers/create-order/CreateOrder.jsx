import React, { useEffect, useMemo, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, MapPin, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";

import Wrapper from "../../../components/wrappers/Wrapper";
import { BackLink } from "../../../components/shared/back-link";
import { H2 } from "../../../components/shared/typography";
import Stepper from "../../../components/customer/create-order/Stepper";
import { Button } from "../../../components/ui/button";
import CartSheet from "../../../components/customer/create-order/Cart";
import Categories from "../../../components/customer/create-order/Categories";
import Services from "../../../components/customer/create-order/Services";
import ProductsAndPackages from "../../../components/customer/create-order/ProductsAndPackages";
import Checkout from "../../../components/customer/create-order/Checkout";
import CustomerAddresses from "../../../components/customer/CustomerAddresses";
import {
  clearCreateOrderDraft,
  setLastVisitedStep,
  startDraftForCustomer,
} from "../../../store/slices/createOrderDraftSlice";
import { clearCart } from "../../../store/slices/cartSlice";

const getCurrentStep = (path) => {
  if (path.includes("/checkout")) return 5;
  if (path.includes("/products")) return 4;
  if (path.includes("/services")) return 3;
  if (path.includes("/categories")) return 2;
  return 1;
};

const resolveDraftRoute = ({ customerId, draft, cartItems }) => {
  if (cartItems.length > 0) {
    return `/admin/customers/${customerId}/create-order/checkout`;
  }

  if (draft.selectedService?.id && draft.selectedCategory?.id) {
    return `/admin/customers/${customerId}/create-order/userAddresses/categories/${draft.selectedCategory.id}/services/${draft.selectedService.id}/products`;
  }

  if (draft.selectedCategory?.id) {
    return `/admin/customers/${customerId}/create-order/userAddresses/categories/${draft.selectedCategory.id}/services`;
  }

  if (draft.selectedAddress?._id) {
    return `/admin/customers/${customerId}/create-order/userAddresses/categories`;
  }

  return `/admin/customers/${customerId}/create-order`;
};

const CreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const cartItems = useSelector((state) => state.cart.items);
  const draft = useSelector((state) => state.createOrderDraft);

  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const step = getCurrentStep(location.pathname);
  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Number(item.offerPrice || 0) * Number(item.quantity || 0),
        0,
      ),
    [cartItems],
  );

  const hasForeignDraft =
    draft.customerId &&
    draft.customerId !== params.customerId &&
    (cartItems.length > 0 || draft.selectedAddress);

  useEffect(() => {
    if (!hasForeignDraft && params?.customerId) {
      dispatch(startDraftForCustomer(params.customerId));
    }
  }, [dispatch, hasForeignDraft, params?.customerId]);

  useEffect(() => {
    dispatch(setLastVisitedStep(step));
  }, [dispatch, step]);

  const goToStep = (targetStep) => {
    if (!draft.selectedAddress?._id && targetStep > 1) {
      toast.error("Select an address before moving to the next step");
      navigate(`/admin/customers/${params.customerId}/create-order`);
      return;
    }

    if (targetStep === 3 && !draft.selectedCategory?.id) {
      toast.error("Pick a category first");
      navigate(
        `/admin/customers/${params.customerId}/create-order/userAddresses/categories`,
      );
      return;
    }

    if (targetStep === 4 && !draft.selectedService?.id) {
      toast.error("Pick a service first");
      navigate(
        draft.selectedCategory?.id
          ? `/admin/customers/${params.customerId}/create-order/userAddresses/categories/${draft.selectedCategory.id}/services`
          : `/admin/customers/${params.customerId}/create-order/userAddresses/categories`,
      );
      return;
    }

    if (targetStep === 5 && cartItems.length === 0) {
      toast.error("Add at least one product or package before checkout");
      navigate(
        resolveDraftRoute({
          customerId: params.customerId,
          draft,
          cartItems,
        }),
      );
      return;
    }

    if (targetStep === 1) {
      navigate(`/admin/customers/${params.customerId}/create-order`);
      return;
    }

    if (targetStep === 2) {
      navigate(
        `/admin/customers/${params.customerId}/create-order/userAddresses/categories`,
      );
      return;
    }

    if (targetStep === 3) {
      navigate(
        `/admin/customers/${params.customerId}/create-order/userAddresses/categories/${draft.selectedCategory.id}/services`,
      );
      return;
    }

    if (targetStep === 4) {
      navigate(
        `/admin/customers/${params.customerId}/create-order/userAddresses/categories/${draft.selectedCategory.id}/services/${draft.selectedService.id}/products`,
      );
      return;
    }

    navigate(`/admin/customers/${params.customerId}/create-order/checkout`);
  };

  const isStepEnabled = (targetStep) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return Boolean(draft.selectedAddress?._id);
    if (targetStep === 3) {
      return Boolean(draft.selectedAddress?._id && draft.selectedCategory?.id);
    }
    if (targetStep === 4) {
      return Boolean(
        draft.selectedAddress?._id &&
          draft.selectedCategory?.id &&
          draft.selectedService?.id,
      );
    }

    return Boolean(draft.selectedAddress?._id && cartItems.length > 0);
  };

  const handleDiscardForeignDraft = () => {
    dispatch(clearCart());
    dispatch(clearCreateOrderDraft());
    dispatch(startDraftForCustomer(params.customerId));
    navigate(`/admin/customers/${params.customerId}/create-order`, {
      replace: true,
    });
  };

  const handleResumeForeignDraft = () => {
    navigate(
      resolveDraftRoute({
        customerId: draft.customerId,
        draft,
        cartItems,
      }),
      { replace: true },
    );
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-5">
          <BackLink href={-1}>
            <H2>Create Order</H2>
          </BackLink>

          <Button
            className="relative"
            variant="abhicares"
            onClick={() => setIsCartSheetOpen(true)}
          >
            <ShoppingCartIcon />
            {cartItems.length > 0 && (
              <p className="absolute -right-1 -top-2.5 size-5 rounded-full bg-red-500">
                {cartItems.length}
              </p>
            )}
          </Button>
        </div>

        {hasForeignDraft ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-amber-950">
                    Another customer draft is still active
                  </h3>
                  <p className="mt-1 text-sm text-amber-900">
                    Draft cart items belong to customer ID {draft.customerId}.
                    Resume that draft intentionally or discard it before creating
                    a new order for this customer.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-amber-300 bg-white"
                    onClick={handleDiscardForeignDraft}
                  >
                    Discard Old Draft
                  </Button>
                  <Button variant="abhicares" onClick={handleResumeForeignDraft}>
                    Resume Existing Draft
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Stepper
              currentStep={step}
              onStepClick={goToStep}
              isStepEnabled={isStepEnabled}
            />

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Address: {draft.selectedAddress?.city || "Not selected"}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Category: {draft.selectedCategory?.name || "Not selected"}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Service: {draft.selectedService?.name || "Not selected"}
              </span>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {cartItems.length} item{cartItems.length === 1 ? "" : "s"} in
                    draft
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    Rs {Number(draft.pricingSnapshot?.totalPayable ?? total).toFixed(2)}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {draft.selectedAddress
                    ? `${draft.selectedAddress.addressLine}, ${draft.cityName || draft.selectedAddress.city}`
                    : "Choose an address to start the draft"}
                </p>
                <p className="text-xs text-slate-500">
                  This draft can include products and packages from multiple
                  services and categories.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!draft.selectedAddress?._id}
                  onClick={() =>
                    navigate(
                      `/admin/customers/${params.customerId}/create-order/userAddresses/categories`,
                    )
                  }
                >
                  Add More Services
                </Button>
                <Button
                  variant="abhicares"
                  disabled={cartItems.length === 0}
                  onClick={() => setIsCartSheetOpen(true)}
                >
                  Review Cart
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          <Routes>
            <Route path="/" element={<CustomerAddresses />} />
            <Route path="userAddresses" element={<CustomerAddresses />} />
            <Route path="userAddresses/categories" element={<Categories />} />
            <Route
              path="userAddresses/categories/:categoryId/services"
              element={<Services />}
            />
            <Route
              path="userAddresses/categories/:categoryId/services/:serviceId/products"
              element={<ProductsAndPackages />}
            />
            <Route path="checkout" element={<Checkout />} />
          </Routes>
        </div>

        <CartSheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen} />
      </div>
    </Wrapper>
  );
};

export default CreateOrder;
