import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("jb_user");
const storedAccess = localStorage.getItem("jb_access_token");
const storedRefresh = localStorage.getItem("jb_refresh_token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccess || null,
  refreshToken: storedRefresh || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      localStorage.setItem("jb_user", JSON.stringify(user));
      localStorage.setItem("jb_access_token", access_token);
      localStorage.setItem("jb_refresh_token", refresh_token);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("jb_user");
      localStorage.removeItem("jb_access_token");
      localStorage.removeItem("jb_refresh_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
