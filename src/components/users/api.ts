import { User } from './users.slice';
import { baseApi } from '../../api/api';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<User[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        getUser: build.query<User, number>({
            query: (userId) => `/users/${userId}`,
            providesTags: ['Users'],
        }),
    }),
});
