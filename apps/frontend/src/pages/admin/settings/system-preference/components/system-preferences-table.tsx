import { MouseEventHandler } from 'react';
import { Row as ReactTableRow } from 'react-table';

import { useQueryWithPagination } from 'services/api/types/rtk-query';

import { TableWithPagination } from 'components/table';
import RowActions from 'components/table/row-actions';

import { IFilterOptions } from 'interfaces/IGeneral';
import { ITable } from 'interfaces/ITable';

interface IProps<T, F extends IFilterOptions> extends Partial<ITable> {
  title: string;
  onEdit?: (row: ReactTableRow) => void;
  onDelete?: (row: ReactTableRow) => void;
  useData: useQueryWithPagination<T, F>;
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
  isEditDisabled?: boolean;
  isDeleteDisabled?: boolean;
  newRecordPermission?: string;
  editPermission?: string;
  deletePermission?: string;
}

const SystemPreferencesTable = <T, F extends IFilterOptions>({
  onDelete,
  onEdit,
  isDeleteDisabled,
  editPermission,
  deletePermission,
  newRecordPermission,
  isEditDisabled,
  title,
  ...props
}: IProps<T, F>) => {
  const handleActionClick = (row: ReactTableRow, type: 'edit' | 'delete') => {
    if (row.original && 'id' in row.original) {
      if (type === 'edit' && onEdit) {
        onEdit(row);
        return;
      }

      if (type === 'delete' && onDelete) {
        onDelete(row);
        return;
      }
    }
  };

  const columns = [
    {
      Header: 'Title',
      accessor: 'name',
      disableSortBy: true,
      minWidth: 200,
    },
    {
      Header: 'No. of items',
      accessor: 'items_count',
      disableSortBy: true,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => {
        return (
          <RowActions
            className="action-btns justify-content-center"
            actions={[
              {
                icon: 'delete',
                permission: deletePermission,
                onClick: () => handleActionClick(row, 'delete'),
                disabled: isDeleteDisabled,
              },
              {
                icon: 'edit',
                permission: editPermission,
                onClick: () => handleActionClick(row, 'edit'),
                disabled: isEditDisabled,
              },
            ]}
          />
        );
      },
      disableSortBy: true,
      sticky: 'right',
      width: 100,
    },
  ];

  return (
    <TableWithPagination
      {...props}
      columns={columns}
      saveValueInState
      showHeaderInsideContainer
      newRecordButtonPermission={newRecordPermission}
      pageHeader={<h6 className="fw-bold m-0 text-capitalize">{title}</h6>}
      defaultPageSize={5}
      shadow={false}
    />
  );
};

export default SystemPreferencesTable;
