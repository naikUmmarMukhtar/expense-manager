// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  isEmailVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isEmailVerified = action.payload.isEmailVerified;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
