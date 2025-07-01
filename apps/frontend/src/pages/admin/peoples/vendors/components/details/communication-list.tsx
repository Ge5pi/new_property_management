import { useParams } from 'react-router-dom';

import { useGetEmailQuery } from 'services/api/emails';

import { ItemDate } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import { TableWithPagination } from 'components/table';

import { SendEmailModal } from 'core-ui/popups/send-email';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { isPositiveNumber } from 'utils/functions';

const VendorCommunicationList = () => {
  const { redirect } = useRedirect();
  const { vendor: vendor_id } = useParams();
  const columns = [
    {
      Header: 'From',
      accessor: 'from',
      minWidth: 200,
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      minWidth: 300,
    },
    {
      Header: 'Date',
      accessor: 'created_at',
      Cell: ItemDate,
    },
  ];

  return (
    <PageContainer className="my-4">
      <TableWithPagination
        clickable
        columns={columns}
        useData={useGetEmailQuery}
        showHeaderInsideContainer
        filterValues={{ vendors: vendor_id }}
        searchable={false}
        saveValueInState
        pageHeader={<h2 className="fs-6 fw-bold mb-0">Emails</h2>}
        newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
        newRecordButtonText="Send Email"
        handleCreateNewRecord={() => {
          if (vendor_id && isPositiveNumber(vendor_id)) {
            SweetAlert({
              size: 'lg',
              html: <SendEmailModal vendor_id={vendor_id} />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }
        }}
        onRowClick={row => {
          if (row.original) {
            if ('id' in row.original) {
              const email_id = row.original['id'];
              redirect(`/communication/emails/details/${email_id}`, false, 'peoples');
            }
          }
        }}
      />
    </PageContainer>
  );
};

export default VendorCommunicationList;
