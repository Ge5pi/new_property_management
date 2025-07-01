import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateRentalTemplateMutation,
  useDeleteRentalTemplateMutation,
  useGetRentalTemplatesQuery,
} from 'services/api/rental-templates';

import { Confirmation } from 'components/alerts';
import { ItemDate } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { DeleteBtn } from 'core-ui/delete-btn';
import { NewApplicationTemplateModal } from 'core-ui/popups/new-template';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import TemplateWrapper from './components/template-wrapper';

const Templates = () => {
  const { redirect } = useRedirect();

  const [
    createTemplate,
    { isSuccess: isCreateTemplateSuccess, isError: isCreateTemplateError, error: createTemplateError },
  ] = useCreateRentalTemplateMutation();

  useResponse({
    isSuccess: isCreateTemplateSuccess,
    successTitle: 'New Rental Template has been added',
    isError: isCreateTemplateError,
    error: createTemplateError,
  });

  const [
    deleteRentalTemplateByID,
    {
      isSuccess: isDeleteRentalTemplateSuccess,
      isError: isDeleteRentalTemplateError,
      error: deleteRentalTemplateError,
    },
  ] = useDeleteRentalTemplateMutation();

  useResponse({
    isSuccess: isDeleteRentalTemplateSuccess,
    successTitle: 'You have deleted template',
    isError: isDeleteRentalTemplateError,
    error: deleteRentalTemplateError,
  });

  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        deleteRentalTemplateByID(id);
      }
    });
  };

  const columns = [
    {
      Header: 'Template name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Description',
      accessor: 'description',
      minWidth: 300,
    },
    {
      Header: 'Created date',
      accessor: 'created_at',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => {
        if (row.original) {
          if ('id' in row.original) {
            const template = row.original['id'];
            return (
              <div className="text-center action-btns">
                <DeleteBtn permission={PERMISSIONS.LEASING} onClick={() => deleteRecord(template as string)} />
              </div>
            );
          }
        }

        return null;
      },
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

  return (
    <TableWithPagination
      clickable
      columns={columns}
      useData={useGetRentalTemplatesQuery}
      pageHeader={<TemplateWrapper />}
      newRecordButtonPermission={PERMISSIONS.LEASING}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'lg',
          html: <NewApplicationTemplateModal createTemplate={createTemplate} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const template = row.original['id'];
            redirect(`${template}/details`);
          }
        }
      }}
    />
  );
};

export default Templates;
