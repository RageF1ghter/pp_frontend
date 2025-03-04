import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    username: null,
    email: null,
    status: false,
    
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action){
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.status = true;
        },
        logout(state){
            state.userId = null;
            state.username = null;
            state.email = null;
            state.status = false;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;