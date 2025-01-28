import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  email: localStorage.getItem("email") || null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.email = action.payload.email; 
      state.username = action.payload.username;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("email", action.payload.email); 
      localStorage.setItem("userName", action.payload.username);  
    },
    logout(state) {
      state.isLoggedIn = false;
      state.email = null; // Clear the email
      state.username = null; // Clear the username
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("email"); // Remove email from localStorage
      localStorage.removeItem("userName"); // Remove username from localStorage
    },
  },
});

// Export the actions and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
