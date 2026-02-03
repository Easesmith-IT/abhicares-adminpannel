import { configureStore } from '@reduxjs/toolkit';

import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';
import autorizationSlice from './slices/autorizationSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        cart:cartSlice,
        auth:autorizationSlice
    }
});