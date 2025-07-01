/* eslint-disable */
import { TypedMutationTrigger, TypedUseQuery, TypedUseQueryHookResult } from '@reduxjs/toolkit/dist/query/react';
import { BaseQueryFn, MutationActionCreatorResult, MutationDefinition } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig } from 'axios';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

export type BaseQueryError = { status: number; data: { [key: string]: string | string[] } };

export declare type GenericMutationTrigger<Q, R> = TypedMutationTrigger<
  R,
  Q,
  BaseQueryFn<
    {
      url: string;
      data?: AxiosRequestConfig['data'];
      method: AxiosRequestConfig['method'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  >
>;

export type GenericMutationResult<T, E extends string, K> = MutationActionCreatorResult<
  MutationDefinition<
    T,
    BaseQueryFn<
      {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
      },
      unknown,
      unknown
    >,
    E,
    K,
    'api'
  >
>;

export declare type GenericQueryHookResult<Q, R> = TypedUseQueryHookResult<
  R,
  Q,
  BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  >
>;

export declare type FuncParamsType = number | string;
export declare type useQueryWithPagination<R, A> = TypedUseQuery<
  IPaginationData<R>,
  A,
  BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  >
>;

export declare type ReduxQueryReturnType<T = unknown, E = unknown, M = unknown> =
  | {
      error: E;
      data?: undefined;
      meta?: M;
    }
  | {
      error?: undefined;
      data: T;
      meta?: M;
    };
