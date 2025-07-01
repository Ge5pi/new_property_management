import { useParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useGetWorkOrderLaborQuery } from 'services/api/work-orders';

import { ItemDate } from 'components/custom-cell';
import { SimpleTable } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { LaborModal } from 'core-ui/popups/labor';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { ILabor } from 'interfaces/IWorkOrders';

interface IProps {
  updateLabor?: (id: string | number, data: ILabor) => Promise<{ data: ILabor } | { error: unknown }>;
  addLabor?: (data: ILabor) => Promise<{ data: ILabor } | { error: unknown }>;
}

const LaborDetailsTable = ({ updateLabor, addLabor }: IProps) => {
  const { order } = useParams();
  const { data: labors = [], ...rest } = useGetWorkOrderLaborQuery(getValidID(order));

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      width: '250px',
    },
    {
      Header: 'Description',
      accessor: 'description',
      minWidth: 300,
    },
    {
      Header: 'Hours',
      accessor: 'hours',
    },
    {
      Header: 'Created',
      accessor: 'date',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => (
        <MoreOptions
          className="text-center"
          actions={[
            {
              text: 'Edit',
              permission: PERMISSIONS.MAINTENANCE,
              onClick: () => {
                const row1 = row.original as ILabor;
                if (row1.id) {
                  SweetAlert({
                    html: <LaborModal labor={row1} updateLabor={updateLabor} update />,
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }
              },
            },
          ]}
        />
      ),
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  return (
    <SimpleTable
      {...rest}
      data={labors}
      shadow={false}
      showTotal={false}
      showHeaderInsideContainer
      wrapperClass="detail-section-table border-0"
      newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
      classes={{ body: 'p-0 border-0' }}
      handleCreateNewRecord={() => {
        SweetAlert({
          html: <LaborModal addLabor={addLabor} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      pageHeader={<p className="fw-bold m-0 text-primary">Labor Details</p>}
      columns={columns}
    />
  );
};

export default LaborDetailsTable;
