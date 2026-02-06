import { configureStore } from '@reduxjs/toolkit';

import autorizationSlice from './slices/autorizationSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        auth:autorizationSlice
    }
});