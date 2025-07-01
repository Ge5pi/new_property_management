import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { getUserAccountType, parseURLParams } from 'utils/functions';

import { IRoles, IUser } from 'interfaces/IAvatar';
import { IFilterOptions, IIDName, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const usersAPIs = api.injectEndpoints({
  endpoints: build => ({
    getUsers: build.query<IPaginationData<IUser>, IFilterOptions>({
      query: params => ({
        url: `/api/authentication/users/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IUser>) => {
        response.results = response.results.map(result => ({
          ...result,
          account_type: getUserAccountType(result),
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Users', id: 'PARTIAL-LIST' }],
    }),
    getUserById: build.query<IUser, number>({
      query: id => ({
        url: `/api/authentication/users/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    createUser: build.mutation<IUser, IUser>({
      query: data => ({
        url: `/api/authentication/users/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'PARTIAL-LIST' }],
    }),
    updateUser: build.mutation<IUser, Partial<IUser>>({
      query: data => ({
        url: `/api/authentication/users/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'PARTIAL-LIST' },
        'CurrentUser',
      ],
    }),
    deleteUser: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/authentication/users/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'PARTIAL-LIST' },
      ],
    }),

    // Roles

    getRoles: build.query<IPaginationData<IRoles>, IFilterOptions>({
      query: params => ({
        url: `/api/authentication/roles/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'UserRoles' as const, id })),
              { type: 'UserRoles', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'UserRoles', id: 'PARTIAL-LIST' }],
    }),
    getRoleById: build.query<IRoles, number>({
      query: id => ({
        url: `/api/authentication/roles/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'UserRoles', id }],
    }),
    createRole: build.mutation<IRoles, IRoles>({
      query: data => ({
        url: `/api/authentication/roles/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'UserRoles', id: 'PARTIAL-LIST' }],
    }),
    updateRole: build.mutation<IRoles, Partial<IRoles>>({
      query: data => ({
        url: `/api/authentication/roles/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'UserRoles', id },
        { type: 'UserRoles', id: 'PARTIAL-LIST' },
        'Users',
        'CurrentUser',
      ],
    }),
    deleteRole: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/authentication/roles/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'UserRoles', id },
        { type: 'UserRoles', id: 'PARTIAL-LIST' },
        'Users',
        'CurrentUser',
      ],
    }),
    getListOfRoles: build.query<IRoles[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/authentication/roles/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: IRoles[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as IRoles;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'UserRoles' as const, id }))
          : ids.map(id => ({ type: 'UserRoles' as const, id })),
    }),

    // Groups
    getGroups: build.query<IIDName[], void>({
      query: () => ({
        url: `/api/authentication/groups/`,
        method: 'get',
      }),
      providesTags: ['Groups'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,

  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useGetListOfRolesQuery,

  useGetGroupsQuery,
} = usersAPIs;
