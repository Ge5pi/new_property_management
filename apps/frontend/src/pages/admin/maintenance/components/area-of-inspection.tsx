import { useCallback, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateInspectionAreaItemsMutation,
  useDeleteInspectionAreaMutation,
  useGetInspectionAreaQuery,
  useUpdateInspectionAreaMutation,
} from 'services/api/inspections';

import { Confirmation, PleaseWait } from 'components/alerts';
import MoreOptions from 'components/table/more-options';

import { AddIcon } from 'core-ui/icons';
import { AddArea, AddNewItem } from 'core-ui/popups/inspections';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import AreaItems from './area-item';

const AreaOfInspection = () => {
  const { inspection: inspection_id } = useParams();
  const areas = useGetInspectionAreaQuery(getValidID(inspection_id));

  const [
    createNewAreaItem,
    {
      isSuccess: isCreateInspectionAreaItemSuccess,
      isError: isCreateInspectionAreaItemError,
      error: createInspectionAreaItemError,
    },
  ] = useCreateInspectionAreaItemsMutation();

  useResponse({
    isSuccess: isCreateInspectionAreaItemSuccess,
    successTitle: 'You have successfully added new Area Item',
    isError: isCreateInspectionAreaItemError,
    error: createInspectionAreaItemError,
  });

  const [
    updateArea,
    {
      isSuccess: isUpdateInspectionAreaSuccess,
      isError: isUpdateInspectionAreaError,
      error: updateInspectionAreaError,
    },
  ] = useUpdateInspectionAreaMutation();

  useResponse({
    isSuccess: isUpdateInspectionAreaSuccess,
    successTitle: 'Record has been successfully updated!',
    isError: isUpdateInspectionAreaError,
    error: updateInspectionAreaError,
  });

  const [deleteArea, { isSuccess: isDeleteAreaSuccess, isError: isDeleteAreaError, error: deleteAreaError }] =
    useDeleteInspectionAreaMutation();

  useResponse({
    isSuccess: isDeleteAreaSuccess,
    successTitle: 'Area has been deleted',
    isError: isDeleteAreaError,
    error: deleteAreaError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = useCallback(
    (id: string | number) => {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed && inspection_id) {
          PleaseWait();
          setDisabled(true);
          deleteArea({ id, inspection_id }).finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
        }
      });
    },
    [deleteArea, inspection_id]
  );

  return (
    <ApiResponseWrapper
      {...areas}
      showMiniError
      renderResults={data => {
        return (
          <>
            {data.map((area, ki) => (
              <Card className="border-md border border-2 page-section my-2" key={ki}>
                <Card.Header className="bg-transparent py-2 border-0">
                  <Row className="gx-0 align-items-center flex-wrap">
                    <Col>
                      <p className="card-title fw-bold m-0 text-primary">{area.name}</p>
                    </Col>
                    <Col xs={'auto'}>
                      <MoreOptions
                        actions={[
                          {
                            disabled,
                            text: 'Edit',
                            permission: PERMISSIONS.MAINTENANCE,
                            onClick: () => {
                              SweetAlert({
                                html: (
                                  <AddArea
                                    inspection={inspection_id ?? ''}
                                    updateInspectionArea={updateArea}
                                    update={true}
                                    area={area}
                                  />
                                ),
                              }).fire({
                                allowOutsideClick: () => !SwalExtended.isLoading(),
                              });
                            },
                          },
                          {
                            disabled,
                            text: 'Delete',
                            permission: PERMISSIONS.MAINTENANCE,
                            onClick: () => deleteRecord(Number(area.id)),
                            className: 'text-danger',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="p-0">
                  <AreaItems area_id={Number(area.id)} />
                </Card.Body>

                <Card.Footer className="border-0 text-center">
                  <Button
                    size="sm"
                    variant="light"
                    className="p-1 border-0 d-inline-flex align-items-center"
                    onClick={() => {
                      SweetAlert({
                        html: <AddNewItem area={Number(area.id)} createInspectionAreaItem={createNewAreaItem} />,
                      }).fire({
                        allowOutsideClick: () => !SwalExtended.isLoading(),
                      });
                    }}
                  >
                    <AddIcon />
                    <span className="mx-1">Add Item</span>
                  </Button>
                </Card.Footer>
              </Card>
            ))}
            {data.length <= 0 && (
              <Card className="border-md border border-2 shadow-none my-2">
                <Card.Body className="text-center">No Area Item</Card.Body>
              </Card>
            )}
          </>
        );
      }}
    />
  );
};

export default AreaOfInspection;
