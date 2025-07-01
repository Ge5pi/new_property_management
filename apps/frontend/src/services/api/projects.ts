import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IProjects, ProjectStatusType } from 'interfaces/IMaintenance';

import { api } from './base';

declare type FilterStatusType = ProjectStatusType | '';
declare type ProjectsFilters = IFilterOptions & {
  status?: FilterStatusType;
};

const projectsAPI = api.injectEndpoints({
  endpoints: build => ({
    getProjects: build.query<IPaginationData<IProjects>, ProjectsFilters>({
      query: params => ({
        url: `/api/maintenance/projects/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IProjects>) => {
        response.results = response.results.map(result => ({
          ...result,
          status_with_obj: {
            displayValue: result.get_status_display,
            status: result.status,
            className: {
              PENDING: 'text-muted',
              IN_PROGRESS: 'text-warning',
              COMPLETED: 'text-success',
            },
          },
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Projects' as const, id })),
              { type: 'Projects', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Projects', id: 'PARTIAL-LIST' }],
    }),
    getProjectsById: build.query<IProjects, number>({
      query: id => ({
        url: `/api/maintenance/projects/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    createProjects: build.mutation<IProjects, IProjects>({
      query: data => ({
        url: `/api/maintenance/projects/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'PARTIAL-LIST' }],
    }),
    updateProjects: build.mutation<IProjects, Partial<IProjects>>({
      query: data => ({
        url: `/api/maintenance/projects/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Projects', id },
        { type: 'Projects', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteProjects: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/projects/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Projects', id },
        { type: 'Projects', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProjectsQuery,
  useGetProjectsByIdQuery,
  useUpdateProjectsMutation,
  useCreateProjectsMutation,
  useDeleteProjectsMutation,
} = projectsAPI;
