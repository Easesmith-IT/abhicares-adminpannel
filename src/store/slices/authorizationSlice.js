import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpen: false
}

const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        checkAuthorizationFun: (state, action) => {
            state.isOpen = action.payload;
        },
    },
})

export const { checkAuthorizationFun } = authorizationSlice.actions
export default authorizationSlice.reducer
