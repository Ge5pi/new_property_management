import useResponse from 'services/api/hooks/useResponse';
import { useCreateGeneralLabelMutation } from 'services/api/system-preferences';

import { ItemDate, ItemLabel } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { UpcomingActivityModal } from 'core-ui/popups/upcoming-activity';
import ViewEventModal from 'core-ui/popups/view-event/view-event';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { ICalendarList } from 'interfaces/ICalendar';
import { IOwnerUpcomingActivities } from 'interfaces/IPeoples';
import { IPropertyUpcomingActivities } from 'interfaces/IProperties';
import { GeneralLabels } from 'interfaces/ISettings';
import { ITenantUpcomingActivities } from 'interfaces/ITenant';
import { IUnitsUpcomingActivities } from 'interfaces/IUnits';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

interface IProps {
  createUpcomingActivity: (data: IUpcomingActivities) => Promise<
    | {
        data:
          | IOwnerUpcomingActivities
          | IPropertyUpcomingActivities
          | IUnitsUpcomingActivities
          | ITenantUpcomingActivities;
      }
    | {
        error: unknown;
      }
  >;
  data?: readonly object[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  permission?: string;
}

const UpcomingActivities = ({ data = [], createUpcomingActivity, permission, ...rest }: IProps) => {
  const columns = [
    {
      Header: 'Date',
      accessor: 'date',
      disableSortBy: true,
      Cell: ItemDate,
      width: 200,
    },
    {
      Header: 'Description',
      accessor: 'description',
      disableSortBy: true,
    },
    {
      Header: 'Label',
      accessor: (originalRow: object) => {
        if ('label' in originalRow) {
          if (typeof originalRow.label === 'string') {
            return originalRow.label ?? '-';
          }

          if (typeof originalRow.label === 'number') {
            if ('label_name' in originalRow && typeof originalRow.label_name === 'string')
              return originalRow.label_name ?? '-';
          }

          if (originalRow.label) {
            return (originalRow.label as GeneralLabels).name ?? '-';
          }

          return;
        }
      },
      disableSortBy: true,
      Cell: ItemLabel,
      minWidth: 200,
    },
  ];

  const [createGeneralLabel, { isError: isCreateGeneralLabelError, error: createGeneralLabelError }] =
    useCreateGeneralLabelMutation();

  useResponse({
    isError: isCreateGeneralLabelError,
    error: createGeneralLabelError,
  });

  return (
    <div className="min-h-100 border page-section pgr-white">
      <SimpleTable
        {...rest}
        clickable
        data={data}
        shadow={false}
        showTotal={false}
        wrapperClass="detail-section-table"
        showHeaderInsideContainer
        pageHeader={<p className="fw-bold m-0 text-primary">Upcoming Activities</p>}
        columns={columns}
        newRecordButtonPermission={permission}
        onRowClick={row => {
          SweetAlert({
            size: 'lg',
            html: <ViewEventModal event={row.original as ICalendarList} />,
          }).fire({
            allowOutsideClick: () => !SwalExtended.isLoading(),
          });
        }}
        handleCreateNewRecord={() => {
          SweetAlert({
            size: 'lg',
            html: (
              <UpcomingActivityModal createLabel={createGeneralLabel} createUpcomingActivity={createUpcomingActivity} />
            ),
          }).fire({
            allowOutsideClick: () => !SwalExtended.isLoading(),
          });
        }}
      />
    </div>
  );
};

export default UpcomingActivities;
