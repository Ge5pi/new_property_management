import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateInspectionsMutation,
  useDeleteInspectionMutation,
  useGetInspectionsQuery,
  useUpdateInspectionsMutation,
} from 'services/api/inspections';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { AddInspections } from 'core-ui/popups/inspections';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IInspectionsAPI } from 'interfaces/IInspections';

import InspectionWrapper from './inspection-wrapper';

import '../maintenance.styles.css';

const Inspections = () => {
  const { redirect } = useRedirect();

  const [
    createInspection,
    { isSuccess: isCreateInspectionSuccess, isError: isCreateInspectionError, error: createInspectionError },
  ] = useCreateInspectionsMutation();

  useResponse({
    isSuccess: isCreateInspectionSuccess,
    successTitle: 'New Inspection record has been successfully created!',
    isError: isCreateInspectionError,
    error: createInspectionError,
  });

  const columns = [
    {
      Header: 'Unit name',
      accessor: 'item',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Title',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: InspectionActions,
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
    <InspectionWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetInspectionsQuery}
          pageHeader={'Inspections'}
          filterMenu={component}
          filterValues={{ ...filterValue }}
          newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
          handleCreateNewRecord={() => {
            SweetAlert({
              html: <AddInspections createInspection={createInspection} />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
          onRowClick={row => {
            if (row.original) {
              if ('id' in row.original) {
                const inspection = row.original['id'];
                redirect(`details/${inspection}`);
              }
            }
          }}
        />
      )}
    </InspectionWrapper>
  );
};

export default Inspections;

const InspectionActions = ({ row }: { row: ReactTableRow }) => {
  // update inspection
  const [
    updateInspection,
    { isSuccess: isUpdateInspectionSuccess, isError: isUpdateInspectionError, error: updateInspectionError },
  ] = useUpdateInspectionsMutation();

  useResponse({
    isSuccess: isUpdateInspectionSuccess,
    successTitle: 'Inspection details has been successfully updated!',
    isError: isUpdateInspectionError,
    error: updateInspectionError,
  });

  const [
    deleteInspectionByID,
    { isSuccess: isDeleteInspectionSuccess, isError: isDeleteInspectionError, error: deleteInspectionError },
  ] = useDeleteInspectionMutation();

  useResponse({
    isSuccess: isDeleteInspectionSuccess,
    successTitle: 'You have deleted an Inspection',
    isError: isDeleteInspectionError,
    error: deleteInspectionError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteInspectionByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <MoreOptions
      className="text-center"
      actions={[
        {
          disabled,
          text: 'Edit',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const inspection = row.original as IInspectionsAPI;
            if (inspection.id) {
              SweetAlert({
                html: <AddInspections update={true} inspection={inspection} updateInspection={updateInspection} />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const row1 = row.original as IInspectionsAPI;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};
