import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const baseUrl = 'https://jsonplaceholder.typicode.com';

export const baseApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ['Posts', 'Users', 'Comments'],
    endpoints: () => ({}),
});
