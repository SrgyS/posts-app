import { baseApi } from '../api/baseApi';
import { configureStore } from '@reduxjs/toolkit';
import { favoritesSlice } from '../modules/posts/posts.slice';

export const store = configureStore({
    reducer: {
        favorites: favoritesSlice.reducer,

        [baseApi.reducerPath]: baseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
