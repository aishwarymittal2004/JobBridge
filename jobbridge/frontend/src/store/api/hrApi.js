import { baseApi } from "./baseApi";

export const hrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCandidates: builder.query({
      query: (params) => ({ url: "/hr/candidates", params }),
      providesTags: ["Candidates"],
    }),
    getCandidate: builder.query({
      query: (id) => `/hr/candidates/${id}`,
    }),
    getCandidateResume: builder.query({
      query: (id) => `/hr/candidates/${id}/resume`,
    }),
    sendMessage: builder.mutation({
      query: (body) => ({ url: "/hr/messages", method: "POST", body }),
      invalidatesTags: ["Messages"],
    }),
    getMessagesWithCandidate: builder.query({
      query: (candidateId) => `/hr/messages/${candidateId}`,
      providesTags: ["Messages"],
    }),
  }),
});

export const {
  useListCandidatesQuery,
  useGetCandidateQuery,
  useGetCandidateResumeQuery,
  useSendMessageMutation,
  useGetMessagesWithCandidateQuery,
} = hrApi;
