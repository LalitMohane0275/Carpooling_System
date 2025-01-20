import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,  
  },
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
