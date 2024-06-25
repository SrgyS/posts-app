import { baseApi } from '../api/api';
import { configureStore } from '@reduxjs/toolkit';

// export const extraArgument = {
//     router,
// };

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
