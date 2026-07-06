import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const toDateOnlyString = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeSlot = (slot) => {
  if (!slot) return null;

  return {
    date: toDateOnlyString(slot.date),
    time: slot.time || "",
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== action.payload);
        }
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },

    setItemSlot: (state, action) => {
      const { itemId, slot } = action.payload;

      const item = state.items.find((i) => i._id === itemId);
      if (item) {
        item.slot = normalizeSlot(slot);
      }
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  setItemSlot,
} = cartSlice.actions;

export default cartSlice.reducer;
