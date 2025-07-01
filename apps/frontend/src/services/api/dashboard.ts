import { parseURLParams } from 'utils/functions';

import { IDashboardGeneralStatistics, IDashboardStatistics, IPortfolioProperty } from 'interfaces/IDashboard';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

import { api } from './base';

declare type UpcomingActivityTypes = 'properties' | 'units' | 'tenants' | 'owners';
const dashboardAPI = api.injectEndpoints({
  endpoints: build => ({
    getDashboardStatistics: build.query<IDashboardStatistics, void>({
      query: () => ({
        url: `/api/dashboard/dashboard-stats/`,
        method: 'GET',
      }),
      providesTags: [{ type: 'DashboardStatistics' }],
    }),
    getDashboardGeneralStatistics: build.query<IDashboardGeneralStatistics, void>({
      query: () => ({
        url: `/api/dashboard/general-stats/`,
        method: 'GET',
      }),
      providesTags: [{ type: 'DashboardGeneralStatistics' }],
    }),
    getPortfolioProperties: build.query<IPaginationData<IPortfolioProperty>, IFilterOptions>({
      query: params => ({
        url: `/api/property/portfolio-properties/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'PropertiesPortfolio' as const, id })),
              { type: 'PropertiesPortfolio', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertiesPortfolio', id: 'PARTIAL-LIST' }],
    }),
    getUpcomingActivities: build.query<IPaginationData<IUpcomingActivities>, UpcomingActivityTypes>({
      query: route => ({
        url: getUpcomingURL(route),
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'DashboardUpcomingActivity' as const, id })),
              { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' }],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetDashboardGeneralStatisticsQuery,
  useGetPortfolioPropertiesQuery,
  useGetUpcomingActivitiesQuery,
} = dashboardAPI;

const getUpcomingURL = (route: UpcomingActivityTypes) => {
  let path = '';
  switch (route) {
    case 'owners':
      path = `people/owner-upcoming-activity`;
      break;
    case 'tenants':
      path = `people/tenants-upcoming-activity`;
      break;
    case 'properties':
      path = `property/upcoming-activities`;
      break;
    case 'units':
      path = `property/unit-upcoming-activities`;
      break;
    default:
      path = `property/upcoming-activities`;
  }

  return `/api/${path}/?size=3`;
};
