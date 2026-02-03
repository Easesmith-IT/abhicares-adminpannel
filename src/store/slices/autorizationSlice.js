import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpen: false
}

const autorizationSlice = createSlice({
    name: 'autorization',
    initialState,
    reducers: {
        checkAuthorizationFun: (state, action) => {
            state.isOpen = action.payload;
        },
    },
})

export const { checkAuthorizationFun } = autorizationSlice.actions
export default autorizationSlice.reducer

