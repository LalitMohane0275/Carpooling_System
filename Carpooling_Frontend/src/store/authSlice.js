import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  username: localStorage.getItem("username") || null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.username = action.payload.username; 
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("username", action.payload.username); // Save username to localStorage
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = null; // Clear the username
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username"); // Remove username from localStorage
    },
  },
});

// Export the actions and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
