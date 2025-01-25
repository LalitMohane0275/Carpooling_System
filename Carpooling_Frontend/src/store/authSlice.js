import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.setItem("isLoggedIn", false);
    },
  },
});

// Export the actions and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
