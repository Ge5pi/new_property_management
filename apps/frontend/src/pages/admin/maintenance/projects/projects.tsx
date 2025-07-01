import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateProjectsMutation,
  useDeleteProjectsMutation,
  useGetProjectsQuery,
  useUpdateProjectsMutation,
} from 'services/api/projects';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemPrice, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { ProjectModal } from 'core-ui/popups/projects';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IProjects } from 'interfaces/IMaintenance';

import ProjectWrapper from './project-wrapper';

import './../maintenance.styles.css';

const Projects = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Project Name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Property',
      accessor: 'parent_property_name',
      minWidth: 200,
    },
    {
      Header: 'Total Budget',
      accessor: 'budget',
      Cell: ItemPrice,
    },
    {
      Header: 'Start Date',
      accessor: 'start_date',
      Cell: ItemDate,
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
      Cell: ItemDate,
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ProjectsActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const [
    createProject,
    { isSuccess: isCreateProjectSuccess, isError: isCreateProjectError, error: createProjectError },
  ] = useCreateProjectsMutation();

  useResponse({
    isSuccess: isCreateProjectSuccess,
    successTitle: 'New Project has been added',
    isError: isCreateProjectError,
    error: createProjectError,
  });

  const handleProject = async (values: IProjects) => {
    return await createProject(values);
  };

  return (
    <ProjectWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetProjectsQuery}
          pageHeader={'Projects'}
          filterMenu={component}
          newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
          filterValues={{ status: filterValue }}
          handleCreateNewRecord={() => {
            SweetAlert({
              html: <ProjectModal createProject={handleProject} />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
          onRowClick={row => {
            if (row.original) {
              if ('id' in row.original) {
                const project = row.original['id'];
                redirect(`details/${project}`);
              }
            }
          }}
        />
      )}
    </ProjectWrapper>
  );
};

const ProjectsActions = ({ row }: { row: ReactTableRow }) => {
  // update Project
  const [
    updateProject,
    { isSuccess: isUpdatedProjectSuccess, isError: isUpdatedProjectError, error: updatedProjectError },
  ] = useUpdateProjectsMutation();

  useResponse({
    isSuccess: isUpdatedProjectSuccess,
    successTitle: 'Project has been successfully updated!',
    isError: isUpdatedProjectError,
    error: updatedProjectError,
  });

  const [
    deleteProjectsByID,
    { isSuccess: isDeleteProjectsSuccess, isError: isDeleteProjectsError, error: deleteProjectsError },
  ] = useDeleteProjectsMutation();

  useResponse({
    isSuccess: isDeleteProjectsSuccess,
    successTitle: 'You have deleted a project',
    isError: isDeleteProjectsError,
    error: deleteProjectsError,
  });

  const [disabled, setDisabled] = useState(false);
  const [project] = useState(row.original as IProjects);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      title: 'Confirmation',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteProjectsByID(id).finally(() => {
          setDisabled(false);
          SwalExtended.close();
        });
      }
    });
  };

  const markAsCompleted = (id: string | number) => {
    Confirmation({
      type: 'info',
      title: 'Confirmation',
      description: 'You are about to change the status of this project to Completed.',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        updateProject({ id: id, status: 'COMPLETED', end_date: new Date().toISOString().split('T')[0] }).finally(() => {
          setDisabled(false);
          SwalExtended.close();
        });
      }
    });
  };

  const markAsInProgress = (id: string | number) => {
    Confirmation({
      type: 'info',
      title: 'Confirmation',
      description: 'You are about to change the status of this project to in progress.',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        updateProject({ id: id, status: 'IN_PROGRESS' }).finally(() => {
          setDisabled(false);
          SwalExtended.close();
        });
      }
    });
  };

  const handleProjectsUpdate = async (values: Partial<IProjects>) => {
    return await updateProject(values);
  };

  return (
    <MoreOptions
      className="text-center"
      actions={[
        {
          disabled: disabled || project.status === 'COMPLETED',
          className: clsx({ 'd-none': project.status === 'COMPLETED' }),
          text: 'Edit',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            if (project.id && project.status !== 'COMPLETED') {
              SweetAlert({
                html: <ProjectModal data={project} updateProject={handleProjectsUpdate} update />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled: disabled || project.status === 'IN_PROGRESS',
          className: clsx({ 'd-none': project.status === 'IN_PROGRESS' }),
          text: 'Delete',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            if (project.id && project.status !== 'IN_PROGRESS') {
              deleteRecord(project.id);
            }
          },
        },
        {
          disabled: disabled || project.status === 'COMPLETED' || project.status === 'PENDING',
          className: clsx({ 'd-none': project.status === 'COMPLETED' || project.status === 'PENDING' }),
          text: 'Mark as completed',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            if (project.id && project.status === 'IN_PROGRESS') {
              markAsCompleted(project.id);
            }
          },
        },
        {
          disabled: disabled || project.status === 'COMPLETED' || project.status === 'IN_PROGRESS',
          className: clsx({ 'd-none': project.status === 'COMPLETED' || project.status === 'IN_PROGRESS' }),
          text: 'Mark as in progress',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            if (project.id && project.status === 'PENDING') {
              markAsInProgress(project.id);
            }
          },
        },
      ]}
    />
  );
};

export default Projects;
