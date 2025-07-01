import { Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateInspectionAreaMutation,
  useGetInspectionsByIdQuery,
  useUpdateInspectionsMutation,
} from 'services/api/inspections';
import { useGetUnitByIdQuery } from 'services/api/units';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { PropertySkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { AddArea, AddInspections } from 'core-ui/popups/inspections';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import { AreaOfInspection } from '../components';

import '../maintenance.styles.css';

const InspectionDetails = () => {
  const [width] = useWindowSize();
  const { inspection: inspection_id } = useParams();

  const inspection = useGetInspectionsByIdQuery(getValidID(inspection_id));
  const unit = useGetUnitByIdQuery(getIDFromObject('unit', inspection.data));

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
    createNewArea,
    {
      isSuccess: isCreateInspectionAreaSuccess,
      isError: isCreateInspectionAreaError,
      error: createInspectionAreaError,
    },
  ] = useCreateInspectionAreaMutation();

  useResponse({
    isSuccess: isCreateInspectionAreaSuccess,
    successTitle: 'New Area created successfully',
    isError: isCreateInspectionAreaError,
    error: createInspectionAreaError,
  });

  return (
    <ApiResponseWrapper
      {...inspection}
      renderResults={data => {
        return (
          <div className="my-3">
            <PageContainer className="mt-3">
              <BackButton />
              <h1 className="fw-bold h4 mt-1">Inspection Details</h1>
              <div className="container-fluid page-section pt-3 pb-3 mt-3">
                <Card className="shadow-none border-0">
                  <Card.Body>
                    <Row className="position-relative">
                      <Col>
                        <p className="fw-bold m-0 text-primary">{data.name}</p>
                        <p className="small">View the inspection information</p>
                      </Col>
                      <Col xs={'auto'}>
                        <EditBtn
                          className="position-absolute top-0 end-0 m-2"
                          permission={PERMISSIONS.MAINTENANCE}
                          onClick={() => {
                            SweetAlert({
                              html: (
                                <AddInspections update={true} inspection={data} updateInspection={updateInspection} />
                              ),
                            }).fire({
                              allowOutsideClick: () => !SwalExtended.isLoading(),
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                  <Row className="gx-lg-4 gx-md-0 gy-md-0 justify-content-between align-items-start">
                    <Col xl={width > 1440 ? 3 : 4} lg={5} md={6}>
                      <ApiResponseWrapper
                        {...unit}
                        hideIfNoResults
                        showError={false}
                        loadingComponent={<PropertySkeleton inverse />}
                        renderResults={unit_data => (
                          <Card.Header className="border-0 bg-transparent">
                            <Card.Img as={LazyImage} border src={unit_data.cover_picture} size="16x9" />
                            <Card.Title className="mt-2 fs-6 fw-bold">{unit_data.name}</Card.Title>
                            <Card.Subtitle className="small mb-3">{unit_data.unit_type_name}</Card.Subtitle>
                          </Card.Header>
                        )}
                      />
                    </Col>
                    <Col xl md={6}>
                      <Card.Body className="border-0 mt-md-3">
                        <RenderInformation title="Date of creation" date={data.date} />
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </div>
              <Card className="shadow-none bg-transparent border-0">
                <Card.Header className="border-0 px-0 bg-transparent text-start">
                  <Row className="gx-0 align-items-center py-1 flex-wrap">
                    <Col>
                      <p className="fw-bold m-0 text-primary">Areas of Inspection</p>
                      <p className="small mb-1">list of areas the property contains and their respective items</p>
                    </Col>
                    <Col xs={'auto'}>
                      <Button
                        variant={'primary'}
                        size="sm"
                        onClick={() => {
                          SweetAlert({
                            html: <AddArea inspection={data.id ?? ''} createInspectionArea={createNewArea} />,
                          }).fire({
                            allowOutsideClick: () => !SwalExtended.isLoading(),
                          });
                        }}
                      >
                        Add New Area
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="text-start p-0">
                  <AreaOfInspection />
                </Card.Body>
              </Card>
            </PageContainer>
          </div>
        );
      }}
    />
  );
};

export default InspectionDetails;
