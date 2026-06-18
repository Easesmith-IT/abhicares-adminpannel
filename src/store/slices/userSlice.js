import { createSlice } from '@reduxjs/toolkit'
import { getSecureItem, setSecureItem } from '../../utils/secureStorage';

const initialState = {
    userId: null,
    isAuthenticated: getSecureItem("user-status", false) || false,
    isAdminAuthenticated: getSecureItem("admin-status", true) || false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUserStatus(state, action) {
            return {
                userId: action.payload
            }
        },
        changeUserAuthStatus(state, action) {
            setSecureItem("user-status", action.payload.isAuthenticated, false);
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        changeAdminStatus(state, action) {
            setSecureItem("admin-status", action.payload.isAdminAuthenticated, true);
            state.isAdminAuthenticated = action.payload.isAdminAuthenticated;
        }
    },
})

export const { changeUserStatus, changeAdminStatus, changeUserAuthStatus } = userSlice.actions
export default userSlice.reducer