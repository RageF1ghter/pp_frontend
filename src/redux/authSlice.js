import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  username: null,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = "user";
    },
    logout(state) {
      state.userId = null;
      state.username = null;
      state.email = null;
      state.role = null;
    },
    guestLogin(state) {
      state.userId = "67a28b8829f3ba8beda0e216";
      state.username = "Guest";
      state.email = "czybaba@gmail.com";
      state.role = "guest";
    },
  },
});

export const { login, logout, guestLogin } = authSlice.actions;
export default authSlice.reducer;
