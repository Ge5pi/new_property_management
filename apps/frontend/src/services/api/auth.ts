import { isExpired } from 'react-jwt';

import { ICurrentUser } from 'interfaces/IAvatar';

import { api } from './base';
import { ReduxQueryReturnType } from './types/rtk-query';

interface ITokenObject {
  access: string;
  refresh: string;
}

declare type IAuthenticatedUser = ICurrentUser & Partial<ITokenObject>;
interface ILoginUser {
  email: string;
  password: string;
  loginFor: 'tenant' | 'admin';
}

declare type AuthFetchType = ReduxQueryReturnType<unknown, unknown>;
const authenticationAPIs = api.injectEndpoints({
  endpoints: build => ({
    authenticateUser: build.mutation<IAuthenticatedUser, ITokenObject>({
      async queryFn(token, _queryApi, _extraOptions, fetchWithBQ) {
        const { access, refresh } = token;

        const isTokenValid = access && !isExpired(access);
        const isRefreshValid = refresh && !isExpired(refresh);

        let tokenVerification: AuthFetchType | undefined = undefined;
        if (isTokenValid && isRefreshValid) {
          tokenVerification = await fetchWithBQ({
            url: '/api/token/verify/',
            data: { token: access },
            method: 'post',
          });
        } else if (!isTokenValid && isRefreshValid) {
          tokenVerification = (await fetchWithBQ({
            url: '/api/token/refresh/',
            data: { refresh },
            method: 'post',
          })) as AuthFetchType;
        }

        if (tokenVerification && tokenVerification.error) {
          return { error: tokenVerification.error };
        }

        if (!access || !refresh || !tokenVerification || !tokenVerification.data) {
          return {
            error: {
              code: 401,
              response: 'Unauthorized',
              message: 'The server could not verify this user. Please try to login again thank you!',
            },
          };
        }

        const currentUser = await fetchWithBQ({
          url: '/api/authentication/current-user-details/',
          method: 'get',
        });

        return currentUser.data
          ? {
              data: { ...currentUser.data, ...tokenVerification.data } as IAuthenticatedUser,
            }
          : { error: currentUser.error };
      },
    }),

    loginUser: build.mutation<IAuthenticatedUser, ILoginUser>({
      async queryFn(loginInfo, _queryApi, _extraOptions, fetchWithBQ) {
        const url =
          loginInfo.loginFor === 'admin' ? `/api/authentication/admin-token/` : `/api/authentication/tenant-token/`;
        const createToken = await fetchWithBQ({ url, method: 'post', data: loginInfo });
        console.log('createToken', createToken);

        if (createToken && createToken.error) {
          return { error: createToken.error };
        }

        const token = createToken.data as ITokenObject;
        localStorage.setItem('ppm-session', token.access);
        localStorage.setItem('ppm-session-ref', token.refresh);
        const currentUser = await fetchWithBQ({
          url: '/api/authentication/current-user-details/',
          method: 'get',
        });

        return currentUser.data
          ? { data: { ...currentUser.data, ...token } as IAuthenticatedUser }
          : { error: currentUser.error };
      },
    }),

    //Me
    getCurrentUser: build.query<ICurrentUser, void>({
      query: () => ({
        url: `/api/authentication/current-user-details/`,
        method: 'get',
      }),
      providesTags: ['CurrentUser'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginUserMutation, useGetCurrentUserQuery, useAuthenticateUserMutation } = authenticationAPIs;
