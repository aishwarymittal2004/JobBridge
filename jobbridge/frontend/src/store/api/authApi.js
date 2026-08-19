import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    candidateSignup: builder.mutation({
      query: (body) => ({ url: "/auth/candidate/signup", method: "POST", body }),
    }),
    hrSignup: builder.mutation({
      query: (body) => ({ url: "/auth/hr/signup", method: "POST", body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
  }),
});

export const { useCandidateSignupMutation, useHrSignupMutation, useLoginMutation } = authApi;
