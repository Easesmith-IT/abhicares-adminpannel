import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerId: "",
  selectedAddress: null,
  cityId: "",
  cityName: "",
  selectedCategory: null,
  selectedService: null,
  couponCode: "",
  appliedCoupon: null,
  pricingSnapshot: null,
  pricingHash: "",
  lastVisitedStep: 1,
};

const getCityName = (address) =>
  address?.city || address?.cityId?.cityName || address?.cityId?.name || "";

const createOrderDraftSlice = createSlice({
  name: "createOrderDraft",
  initialState,
  reducers: {
    startDraftForCustomer: (state, action) => {
      const nextCustomerId = String(action.payload || "");

      if (!nextCustomerId) return;

      if (state.customerId && state.customerId !== nextCustomerId) {
        return {
          ...initialState,
          customerId: nextCustomerId,
        };
      }

      state.customerId = nextCustomerId;
    },

    setSelectedAddress: (state, action) => {
      const { customerId, address } = action.payload || {};

      if (customerId) {
        state.customerId = String(customerId);
      }

      state.selectedAddress = address || null;
      state.cityId = address?.cityBoundary || "";
      state.cityName = getCityName(address);
      state.selectedCategory = null;
      state.selectedService = null;
      state.pricingSnapshot = null;
      state.pricingHash = "";
    },

    setSelectedCategory: (state, action) => {
      const nextCategory = action.payload || null;
      const categoryChanged =
        state.selectedCategory?.id &&
        nextCategory?.id &&
        state.selectedCategory.id !== nextCategory.id;

      state.selectedCategory = nextCategory;

      if (categoryChanged) {
        state.selectedService = null;
      }
    },

    setSelectedService: (state, action) => {
      state.selectedService = action.payload || null;
    },

    setCouponCode: (state, action) => {
      state.couponCode = String(action.payload || "");
      state.appliedCoupon = null;
      state.pricingSnapshot = null;
      state.pricingHash = "";
    },

    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload || null;
    },

    setPricingSnapshot: (state, action) => {
      const { pricingSnapshot, pricingHash } = action.payload || {};
      state.pricingSnapshot = pricingSnapshot || null;
      state.pricingHash = pricingHash || "";
    },

    setLastVisitedStep: (state, action) => {
      state.lastVisitedStep = Number(action.payload || 1);
    },

    clearCreateOrderDraft: () => initialState,
  },
});

export const {
  startDraftForCustomer,
  setSelectedAddress,
  setSelectedCategory,
  setSelectedService,
  setCouponCode,
  setAppliedCoupon,
  setPricingSnapshot,
  setLastVisitedStep,
  clearCreateOrderDraft,
} = createOrderDraftSlice.actions;

export default createOrderDraftSlice.reducer;
