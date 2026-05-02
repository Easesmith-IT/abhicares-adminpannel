import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
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
        item.slot = slot;
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