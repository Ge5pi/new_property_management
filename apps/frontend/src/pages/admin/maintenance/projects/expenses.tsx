import { useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteExpensesMutation, useGetExpensesQuery } from 'services/api/project-expenses';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemPrice } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import RowActions from 'components/table/row-actions';

import { ProjectExpenseModal, ViewExpense } from 'core-ui/popups/projects';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { IExpenses } from 'interfaces/IMaintenance';

interface IProps {
  project_id: number | string;
}

const Expenses = ({ project_id }: IProps) => {
  const columns = [
    {
      Header: 'Expense',
      accessor: 'title',
      minWidth: 200,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ItemPrice,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ExpenseActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  return (
    <TableWithPagination
      clickable
      saveValueInState
      defaultPageSize={5}
      columns={columns}
      useData={useGetExpensesQuery}
      filterValues={{ project: Number(project_id) }}
      pageHeader={<p className="fw-bold m-0 text-primary">Expenses</p>}
      wrapperClass="detail-section-table border-0"
      classes={{ body: 'p-0 border-0' }}
      newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
      handleCreateNewRecord={() => {
        if (project_id && Number(project_id) > 0) {
          SweetAlert({
            size: 'lg',
            html: <ProjectExpenseModal project={project_id} />,
          }).fire({
            allowOutsideClick: () => !SwalExtended.isLoading(),
          });
        }
      }}
      showHeaderInsideContainer
      shadow={false}
      showTotal={false}
      searchable={false}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            SweetAlert({
              size: 'lg',
              html: <ViewExpense expense={row.original as IExpenses} />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }
        }
      }}
    />
  );
};

export default Expenses;

const ExpenseActions = ({ row }: { row: ReactTableRow }) => {
  const [
    deleteExpensesByID,
    { isSuccess: isDeleteExpensesSuccess, isError: isDeleteExpensesError, error: deleteExpensesError },
  ] = useDeleteExpensesMutation();

  useResponse({
    isSuccess: isDeleteExpensesSuccess,
    successTitle: 'You have deleted an expense',
    isError: isDeleteExpensesError,
    error: deleteExpensesError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      title: 'Confirmation',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteExpensesByID(id).finally(() => {
          setDisabled(false);
          SwalExtended.close();
        });
      }
    });
  };

  return (
    <RowActions
      className="action-btns justify-content-center"
      actions={[
        {
          disabled,
          icon: 'delete',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const id = 'id' in row.original ? row.original.id : undefined;
            if (id && typeof id === 'number' && Number(id) > 0) {
              deleteRecord(Number(id));
            }
          },
        },
        {
          icon: 'edit',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const id = 'id' in row.original ? Number(row.original.id) : undefined;
            const project_id = 'project' in row.original ? Number(row.original.project) : undefined;
            if (id && id > 0 && project_id && project_id > 0) {
              SweetAlert({
                size: 'lg',
                html: <ProjectExpenseModal data={row.original as IExpenses} project={project_id} update />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
      ]}
    />
  );
};
