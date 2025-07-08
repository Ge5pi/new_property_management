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
          loginInfo.loginFor === 'admin' ? `/api/authentication/admin-token/` : `/api/authentication/tenant-token/`;
        const createToken = await fetchWithBQ({ url, method: 'post', data: loginInfo });

        if (createToken && createToken.error) {
          return { error: createToken.error };
        }

        // --- START: THE FIX ---

        // 1. Cast the response data to the correct login response interface
        const loginResponse = createToken.data as ILoginResponse;

        // 2. Extract the actual token from the 'token' property
        const accessToken = loginResponse.token;

        if (!accessToken) {
            // Handle cases where the login might succeed but the token is missing
            return { error: { status: 401, data: { detail: 'Login succeeded, but token was not provided.'}}};
        }

        // 3. Save the correct token value to localStorage.
        //    Your old code was saving `undefined` because it was looking for a 'refresh' token that doesn't exist in this response.
        localStorage.setItem('ppm-session', accessToken);
        // localStorage.setItem('ppm-session-ref', token.refresh); // This line is removed as 'refresh' is not part of the login response

        // --- END: THE FIX ---

        // Now that the correct token is saved, this next call will succeed.
        const currentUser = await fetchWithBQ({
          url: '/api/authentication/current-user-details/',
          method: 'get',
        });

        // The user data is available in the original login response, but fetching it again is fine.
        return currentUser.data
          ? { data: { ...currentUser.data } as IAuthenticatedUser } // We no longer need to merge token data here
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
