import { isExpired } from 'react-jwt';

import { ICurrentUser } from 'interfaces/IAvatar';

import { api } from './base';
import { ReduxQueryReturnType } from './types/rtk-query';

interface ITokenObject {
  access: string;
  refresh: string;
}

interface ILoginResponse {
  token: string;
  user: ICurrentUser; // The user object is also in the response
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
          loginInfo.loginFor === 'admin'
            ? `/api/authentication/admin-token/`
            : `/api/authentication/tenant-token/`;
        const createTokenResponse = await fetchWithBQ({ url, method: 'post', data: loginInfo });

        if (createTokenResponse && createTokenResponse.error) {
          return { error: createTokenResponse.error };
        }

        let tokenPayload: Partial<ITokenObject> = {};

        if (loginInfo.loginFor === 'admin') {
          const tokenData = createTokenResponse.data as ITokenObject;
          localStorage.setItem('ppm-session', tokenData.access);
          localStorage.setItem('ppm-session-ref', tokenData.refresh);
          tokenPayload = { access: tokenData.access, refresh: tokenData.refresh };
        } else {
          // tenant
          const tokenData = createTokenResponse.data as ILoginResponse;
          localStorage.setItem('ppm-session', tokenData.token);
          // Tenant does not get a refresh token from this endpoint
          localStorage.removeItem('ppm-session-ref');
          tokenPayload = { access: tokenData.token };
        }

        const currentUserResponse = await fetchWithBQ({
          url: '/api/authentication/current-user-details/',
          method: 'get',
        });

        if (currentUserResponse.error) {
          return { error: currentUserResponse.error };
        }

        const result: IAuthenticatedUser = {
          ...(currentUserResponse.data as ICurrentUser),
          ...tokenPayload,
        };

        return { data: result };
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
