import { configureStore } from '@reduxjs/toolkit';

import authorizationSlice from './slices/authorizationSlice';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authorizationSlice,
    cart: cartSlice,
  },
});