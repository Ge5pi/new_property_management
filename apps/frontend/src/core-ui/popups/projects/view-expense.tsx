import { useCallback, useMemo } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetExpensesAttachmentsQuery } from 'services/api/project-expenses';

import { FilePreview } from 'components/file-attachments';
import { Popup } from 'components/popup';
import Skeleton, { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { getIDFromObject } from 'utils/functions';

import { IExpenses } from 'interfaces/IMaintenance';

function ViewExpense({ expense }: { expense: IExpenses }) {
  const attachments = useGetExpensesAttachmentsQuery(getIDFromObject('id', expense));
  const handleAttachmentClick = useCallback((file: string, request_id: number) => {
    if (file && request_id) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  const assigned_to = useMemo(() => {
    if (expense.assign_to_first_name && expense.assign_to_last_name) {
      return `${expense.assign_to_first_name} ${expense.assign_to_last_name}`;
    }

    return expense.assign_to_username ?? '*';
  }, [expense]);

  return (
    <Popup title="Expense details" openForPreview subtitle="view in-depth detail of an expense">
      <RenderInformation title="Title" description={expense.title} />
      <Row className="gx-sm-1 gx-0">
        <Col md={4} sm={6}>
          <RenderInformation title="Amount" desClass="price-symbol" description={expense.amount} />
        </Col>
        <Col md={4} sm={6}>
          <RenderInformation title="Date" description={expense.date} />
        </Col>
        {assigned_to && assigned_to !== '*' && (
          <Col xs={12}>
            <RenderInformation
              title="Assigned to"
              html={
                <Stack direction="horizontal">
                  <Avatar name={assigned_to} size={30} showName={true} />
                </Stack>
              }
            />
          </Col>
        )}
      </Row>

      <ApiResponseWrapper
        {...attachments}
        hideIfNoResults
        showError={false}
        loadingComponent={
          <InformationSkeleton xxl={5} lg={8} md={7} columnCount={4} skeletonType="column">
            <Card className="border-0 bg-light shadow-sm">
              <Card.Body>
                <Skeleton style={{ width: 25, height: 25 }} />
                <InlineSkeleton xs={8} />
              </Card.Body>
            </Card>
          </InformationSkeleton>
        }
        renderResults={attachment => {
          return (
            <div>
              {attachment.length > 0 && <h4 className="h6 mb-2 fw-medium text-capitalize">Attachments</h4>}

              <Row className="gy-3 gx-sm-1 gx-0">
                {attachment.map((file, indx) => (
                  <Col key={indx} md={4} sm={5}>
                    <FilePreview
                      iconSize="18"
                      className="small"
                      name={file.name}
                      fileType={file.file_type.toLowerCase()}
                      onClick={() => handleAttachmentClick(file.file, Number(expense.id))}
                      bg="secondary"
                    />
                  </Col>
                ))}
              </Row>
            </div>
          );
        }}
      />
    </Popup>
  );
}

export default ProviderHOC(ViewExpense);
