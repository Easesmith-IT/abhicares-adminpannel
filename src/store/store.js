import { configureStore } from '@reduxjs/toolkit';

import autorizationSlice from './slices/autorizationSlice';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: autorizationSlice,
    cart: cartSlice,
  },
});