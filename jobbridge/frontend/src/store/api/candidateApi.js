import { baseApi } from "./baseApi";

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/candidate/me",
    }),
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: "/candidate/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Resume", "CareerFeed"],
    }),
    getResume: builder.query({
      query: () => "/candidate/resume",
      providesTags: ["Resume"],
    }),
    setJobPreference: builder.mutation({
      query: (body) => ({ url: "/candidate/job-preference", method: "PUT", body }),
      invalidatesTags: ["JobPreference", "CareerFeed"],
    }),
    getCareerFeed: builder.query({
      query: (q) => ({ url: "/candidate/career-feed", params: q ? { q } : {} }),
      providesTags: ["CareerFeed"],
    }),
    addFeedback: builder.mutation({
      query: (body) => ({ url: "/candidate/feedback", method: "POST", body }),
      invalidatesTags: ["CareerFeed", "Feedback"],
    }),
    getFeedbackForLink: builder.query({
      query: (careerLinkId) => `/candidate/feedback/${careerLinkId}`,
      providesTags: ["Feedback"],
    }),
    getHrMessages: builder.query({
      query: () => "/candidate/messages",
      providesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUploadResumeMutation,
  useGetResumeQuery,
  useSetJobPreferenceMutation,
  useGetCareerFeedQuery,
  useAddFeedbackMutation,
  useGetFeedbackForLinkQuery,
  useGetHrMessagesQuery,
} = candidateApi;
