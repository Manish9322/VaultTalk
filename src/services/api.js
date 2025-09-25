
// This file will contain API-related logic, such as RTK Query endpoints.

// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['User'],
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
        invalidatesTags: ['User'],
    }),
    loginUser: builder.mutation({
        query: (credentials) => ({
            url: 'login',
            method: 'POST',
            body: credentials,
        }),
        invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
        query: () => 'users',
        providesTags: ['User'],
        transformResponse: (response) => {
            // The user object from the DB has _id, but the frontend uses id.
            return response.map(user => ({ ...user, id: user._id }));
        }
    })
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExampleByNameQuery, useGetDbStatusQuery, useRegisterUserMutation, useLoginUserMutation, useGetAllUsersQuery } = exampleApi
