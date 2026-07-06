import { configureStore } from "@reduxjs/toolkit";

import authorizationSlice from "./slices/authorizationSlice";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
import createOrderDraftSlice from "./slices/createOrderDraftSlice";
import {
  loadCreateOrderDraftState,
  saveCreateOrderDraftState,
} from "../utils/createOrderDraftStorage";

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authorizationSlice,
    cart: cartSlice,
    createOrderDraft: createOrderDraftSlice,
  },
  preloadedState: loadCreateOrderDraftState(),
});

store.subscribe(() => {
  saveCreateOrderDraftState(store.getState());
});
