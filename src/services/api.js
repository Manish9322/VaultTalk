
// This file will contain API-related logic, such as RTK Query endpoints.

// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['User', 'Users'],
  endpoints: (builder) => ({
    getExampleByName: builder.query({
      query: (name) => `example/${name}`,
    }),
    getDbStatus: builder.query({
        query: () => 'db-status',
    }),
    registerUser: builder.mutation({
        query: (userData) => ({
            url: 'register',
            method: 'POST',
            body: userData,
        }),
        invalidatesTags: ['Users'],
    }),
    loginUser: builder.mutation({
        query: (credentials) => ({
            url: 'login',
            method: 'POST',
            body: credentials,
        }),
        invalidatesTags: (result, error, { email }) => [{ type: 'User', id: email }, 'Users'],
    }),
    getAllUsers: builder.query({
        query: () => 'users',
        providesTags: ['Users'],
        transformResponse: (response) => {
            // The user object from the DB has _id, but the frontend uses id.
            return response.map(user => ({ ...user, id: user._id }));
        }
    }),
    sendConnectionRequest: builder.mutation({
        query: ({ currentUserId, targetUserId }) => ({
            url: `users/${targetUserId}/request`,
            method: 'POST',
            body: { currentUserId },
        }),
        invalidatesTags: ['Users'],
    }),
    acceptConnectionRequest: builder.mutation({
        query: ({ currentUserId, targetUserId }) => ({
            url: `users/${targetUserId}/accept`,
            method: 'POST',
            body: { currentUserId },
        }),
        invalidatesTags: ['Users'],
    }),
    declineOrWithdrawConnectionRequest: builder.mutation({
        query: ({ currentUserId, targetUserId, action }) => ({
            url: `users/${targetUserId}/request?currentUserId=${currentUserId}&action=${action}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Users'],
    }),
    removeConnection: builder.mutation({
        query: ({ currentUserId, targetUserId }) => ({
            url: `users/${targetUserId}/remove?currentUserId=${currentUserId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Users'],
    }),
    blockUser: builder.mutation({
        query: ({ currentUserId, targetUserId }) => ({
            url: `users/${targetUserId}/block`,
            method: 'POST',
            body: { currentUserId },
        }),
        invalidatesTags: ['Users'],
    }),
    unblockUser: builder.mutation({
        query: ({ currentUserId, targetUserId }) => ({
            url: `users/${targetUserId}/block?currentUserId=${currentUserId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Users'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
    useGetExampleByNameQuery, 
    useGetDbStatusQuery, 
    useRegisterUserMutation, 
    useLoginUserMutation, 
    useGetAllUsersQuery,
    useSendConnectionRequestMutation,
    useAcceptConnectionRequestMutation,
    useDeclineOrWithdrawConnectionRequestMutation,
    useRemoveConnectionMutation,
    useBlockUserMutation,
    useUnblockUserMutation,
} = exampleApi
