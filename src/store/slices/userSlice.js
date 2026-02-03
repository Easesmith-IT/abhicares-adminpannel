import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    isAuthenticated: JSON.parse(localStorage.getItem("user-status")) || false,
    isAdminAuthenticated: JSON.parse(localStorage.getItem("admin-status")) || false,
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
            localStorage.setItem("user-status", action.payload.isAuthenticated);
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        changeAdminStatus(state, action) {
            localStorage.setItem("admin-status", action.payload.isAdminAuthenticated)
            state.isAdminAuthenticated = action.payload.isAdminAuthenticated;
        }
    },
})

export const { changeUserStatus, changeAdminStatus, changeUserAuthStatus } = userSlice.actions
export default userSlice.reducer