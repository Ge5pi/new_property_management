import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import {
  useCreateRentalApplicantMutation,
  useDeleteRentalApplicantMutation,
  useGetRentalApplicantsQuery,
  useUpdateRentalApplicantMutation,
} from 'services/api/applicants';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemName, ItemStatus, ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import NewApplicantsModal from 'core-ui/popups/new-applicants/new-applicants-modal';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IApplicantForm } from 'interfaces/IApplications';

import RentalWrapper from './rental-wrapper';

const RentalApplications = () => {
  const { redirect } = useRedirect();

  const [
    createApplicant,
    { isSuccess: isCreateApplicantSuccess, isError: isCreateApplicantError, error: createApplicantError },
  ] = useCreateRentalApplicantMutation();

  useResponse({
    isSuccess: isCreateApplicantSuccess,
    successTitle: 'New Rental Applicant has been added',
    isError: isCreateApplicantError,
    error: createApplicantError,
  });

  // TODO : Update any to object shape type in column custom cell components.
  const columns = [
    {
      Header: 'Property / unit',
      accessor: 'property',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Full Name',
      accessor: 'full_name',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Phone number',
      accessor: 'phone_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ApplicantActions,
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
    <RentalWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetRentalApplicantsQuery}
          pageHeader={'Rental applications'}
          filterMenu={component}
          filterValues={filterValue}
          newRecordButtonPermission={PERMISSIONS.LEASING}
          handleCreateNewRecord={() => {
            SweetAlert({
              size: 'lg',
              html: <NewApplicantsModal createApplicant={createApplicant} />,
            })
              .fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              })
              .then(result => {
                if (result.isConfirmed && result.value) {
                  redirect(`${result.value.applicant}/details/${result.value.application}`);
                }
              });
          }}
          onRowClick={row => {
            if (row.original) {
              const row1 = row.original as IApplicantForm;
              if ('id' in row1) {
                const applicant = row1.id;
                const application = row1.rental_application;
                redirect(`${applicant}/details/${application}`);
              }
            }
          }}
        />
      )}
    </RentalWrapper>
  );
};

const ApplicantActions = ({ row }: { row: ReactTableRow }) => {
  // update Applicant
  const [
    updateApplicant,
    { isSuccess: isUpdateApplicantSuccess, isError: isUpdateApplicantError, error: updateApplicantError },
  ] = useUpdateRentalApplicantMutation();

  useResponse({
    isSuccess: isUpdateApplicantSuccess,
    successTitle: 'Applicant detail has been successfully updated!',
    isError: isUpdateApplicantError,
    error: updateApplicantError,
  });

  const [
    deleteRentalApplicantByID,
    {
      isSuccess: isDeleteRentalApplicantSuccess,
      isError: isDeleteRentalApplicantError,
      error: deleteRentalApplicantError,
    },
  ] = useDeleteRentalApplicantMutation();

  useResponse({
    isSuccess: isDeleteRentalApplicantSuccess,
    successTitle: 'You have deleted Applicant',
    isError: isDeleteRentalApplicantError,
    error: deleteRentalApplicantError,
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
        deleteRentalApplicantByID(id).finally(() => {
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
          permission: PERMISSIONS.LEASING,
          onClick: () => {
            const row1 = row.original as IApplicantForm;
            if (row1.id) {
              SweetAlert({
                size: 'lg',
                html: <NewApplicantsModal applicant={row1} updateApplicant={updateApplicant} update />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.LEASING,
          onClick: () => {
            const row1 = row.original as IApplicantForm;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default RentalApplications;
