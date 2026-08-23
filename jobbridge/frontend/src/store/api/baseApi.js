import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST", body: { refresh_token: refreshToken } },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Resume", "CareerFeed", "Feedback", "Messages", "Candidates", "JobPreference"],
  endpoints: () => ({}),
});
