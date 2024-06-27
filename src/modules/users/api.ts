import { User } from './users.slice';
import { baseApi } from '../../api/baseApi';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<User[], void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        getUser: build.query<User, number>({
            query: (userId) => `/users/${userId}`,
            providesTags: ['User'],
        }),
    }),
});
