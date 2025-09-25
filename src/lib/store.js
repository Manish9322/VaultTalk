import { configureStore } from '@reduxjs/toolkit'
import { exampleApi } from '@/services/api'
import exampleReducer from './slices/exampleSlice'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [exampleApi.reducerPath]: exampleApi.reducer,
    example: exampleReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(exampleApi.middleware),
})
