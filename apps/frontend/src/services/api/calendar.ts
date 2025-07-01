import { dayJS, parseURLParams } from 'utils/functions';

import { CalendarFilterModule, ICalendarList } from 'interfaces/ICalendar';
import { IFilterOptions } from 'interfaces/IGeneral';

import { api } from './base';
import { BaseQueryError, ReduxQueryReturnType } from './types/rtk-query';

interface CalendarFilter extends IFilterOptions {
  date_month: string;
  date_year: string;
  module?: CalendarFilterModule;
  label_id?: string;
}

declare type CalendarFetchType = ReduxQueryReturnType<Array<ICalendarList>, BaseQueryError, CalendarFilter>;
const calendarAPIs = api.injectEndpoints({
  endpoints: build => ({
    getCalendarEvents: build.query<Array<ICalendarList>, CalendarFilter>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        const { module: selectedModule, ...rest } = params;
        const queryParams = parseURLParams(rest);
        const ownerURL = `/api/people/owner-upcoming-activity/?${queryParams}`;
        const propertyURL = `/api/property/upcoming-activities/?${queryParams}`;
        const tenantURL = `/api/people/tenants-upcoming-activity/?${queryParams}`;
        const unitURL = `/api/property/unit-upcoming-activities/?${queryParams}`;

        const promises: Array<CalendarFetchType> = [];

        switch (selectedModule) {
          case 'Owner':
            promises.push(fetchWithBQ({ url: ownerURL, method: 'GET' }) as CalendarFetchType);
            break;
          case 'Property':
            promises.push(fetchWithBQ({ url: propertyURL, method: 'GET' }) as CalendarFetchType);
            break;
          case 'Tenant':
            promises.push(fetchWithBQ({ url: tenantURL, method: 'GET' }) as CalendarFetchType);
            break;
          case 'Unit':
            promises.push(fetchWithBQ({ url: unitURL, method: 'GET' }) as CalendarFetchType);
            break;
          default: {
            const property = fetchWithBQ({ url: propertyURL, method: 'GET' }) as CalendarFetchType;
            const unit = fetchWithBQ({ url: unitURL, method: 'GET' }) as CalendarFetchType;
            const owner = fetchWithBQ({ url: ownerURL, method: 'GET' }) as CalendarFetchType;
            const tenant = fetchWithBQ({ url: tenantURL, method: 'GET' }) as CalendarFetchType;
            promises.push(...[property, unit, owner, tenant]);
            break;
          }
        }

        const responses = await Promise.all(promises);
        const successfulResponses = responses
          .filter(r => !r.error)
          .reduce(
            (result, current) => {
              const resultData = result.data ?? [];
              const currentData = current.data ?? [];
              return {
                data: [...resultData, ...currentData].map(result => ({
                  ...result,
                  allDay: false,
                  start: result.start_time
                    ? dayJS(result.date + 'T' + result.start_time).toDate()
                    : dayJS(result.date).toDate(),
                  end: result.end_time
                    ? dayJS(result.date + 'T' + result.end_time).toDate()
                    : dayJS(result.date).toDate(),
                  title: result.title,
                })),
              };
            },
            { data: [] }
          );

        const unsuccessfulResponses = responses.filter(r => r.error);
        if (selectedModule && unsuccessfulResponses.length) {
          return { error: unsuccessfulResponses[0].error as BaseQueryError };
        }

        if (successfulResponses.data) {
          return {
            data: successfulResponses.data,
          };
        }

        return {
          error: {
            status: 500,
            data: 'Something went wrong, unable to fetch calendar events. Please try reloading the page. If the problem persist contact support. Thank you!',
          },
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ month, year }) => ({ type: 'Calendar' as const, id: `${month}-${year}` })),
              { type: 'Calendar', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Calendar', id: 'PARTIAL-LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCalendarEventsQuery } = calendarAPIs;
