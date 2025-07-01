import { useMemo } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetProjectsByIdQuery, useUpdateProjectsMutation } from 'services/api/projects';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetListOfUnitsQuery } from 'services/api/units';

import { BackButton } from 'components/back-button';
import { ItemName, ItemStatus } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import SkeletonProperty, { SkeletonInlineProperty } from 'components/skeleton/placeholder-property';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { ProjectModal } from 'core-ui/popups/projects';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import { IProjects } from 'interfaces/IMaintenance';

import Expenses from './expenses';

import './../maintenance.styles.css';

const ProjectDetails = () => {
  const [width] = useWindowSize();
  const { project: project_id } = useParams();

  const project = useGetProjectsByIdQuery(getValidID(project_id));
  const property = useGetPropertyByIdQuery(getIDFromObject('parent_property', project.data));

  // update Project
  const [
    updateProject,
    { isSuccess: isUpdatedProjectSuccess, isError: isUpdatedProjectError, error: updatedProjectError },
  ] = useUpdateProjectsMutation();

  useResponse({
    isSuccess: isUpdatedProjectSuccess,
    successTitle: 'Project has been successfully updated!',
    isError: isUpdatedProjectError,
    error: updatedProjectError,
  });

  const units = useGetListOfUnitsQuery(
    project.data && project.data.units && project.data.units.length > 0 && !project.data.select_all_units
      ? (project.data.units as number[])
      : skipToken
  );

  const handleProjectsUpdate = async (values: Partial<IProjects>) => {
    return await updateProject(values);
  };

  const propertyName = useMemo(() => {
    if (project.data) {
      const projectData = project.data;
      let property_name = (projectData.parent_property_name ?? '').trim().toLowerCase();
      if (property_name.endsWith('property')) {
        property_name = property_name.replace('property', '');
      }
      return property_name;
    }

    return '';
  }, [project.data]);

  return (
    <ApiResponseWrapper
      {...project}
      renderResults={data => {
        return (
          <div className="my-3">
            <PageContainer className="mt-3">
              <BackButton />
              <h1 className="fw-bold h4 mt-1">Project details</h1>
              <div className="container-fluid page-section pt-3 pb-3">
                <Card className="shadow-none border-0">
                  <Card.Body>
                    <Row className="position-relative">
                      <Col>
                        <p className="fw-bold m-0 text-primary">{data.name}</p>
                        <p className="small">View the project information</p>
                      </Col>
                      <Col xs={'auto'}>
                        <EditBtn
                          className="position-absolute top-0 end-0 m-2"
                          permission={PERMISSIONS.MAINTENANCE}
                          onClick={() => {
                            SweetAlert({
                              html: <ProjectModal data={data} updateProject={handleProjectsUpdate} update />,
                            }).fire({
                              allowOutsideClick: () => !SwalExtended.isLoading(),
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Body>
                    <Row className="gx-lg-4 gx-md-0 gy-md-0 justify-content-between align-items-start">
                      <Col xxl={width <= 1600 ? 4 : 3} md={4}>
                        <ApiResponseWrapper
                          {...property}
                          showError={false}
                          loadingComponent={<SkeletonProperty inverse />}
                          renderResults={result => {
                            return (
                              <Card className="align-items-center border-0 min-h-100">
                                <Card.Img as={LazyImage} border src={result.cover_picture} size="16x9" />
                                <Card.Body className="mt-2 ps-0 w-100 pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                                  <Card.Title className="fw-bold text-capitalize">{result.name}</Card.Title>
                                  {result.property_type && (
                                    <Card.Subtitle className="text-capitalize small mb-3">
                                      {result.property_type_name}
                                    </Card.Subtitle>
                                  )}
                                </Card.Body>
                              </Card>
                            );
                          }}
                        />
                      </Col>
                      <Col xxl={{ span: true, offset: width >= 1600 ? 1 : 0 }} xs>
                        <Card.Body className="border-0 px-md-4 px-0 mt-lg-3">
                          <Row>
                            <Col xl lg={6} md={12} sm={6}>
                              <RenderInformation title="Project basis" description={data.gl_account} />
                            </Col>
                            <Col md sm={6} xs>
                              <RenderInformation title="Start Date" date={data.start_date} />
                            </Col>
                            <Col xs>
                              <RenderInformation title="End Date" date={data.end_date} />
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={4} lg={6} sm={6} xs>
                              <RenderInformation title="Budget" desClass="price-symbol" description={data.budget} />
                            </Col>
                            {data.get_status_display && data.status && (
                              <Col md sm={6} xs>
                                <RenderInformation
                                  title="Status"
                                  html={
                                    <ItemStatus
                                      value={{
                                        statusFor: 'page',
                                        displayValue: data.get_status_display,
                                        status: data.status,
                                        className: {
                                          PENDING: 'text-muted',
                                          IN_PROGRESS: 'text-warning',
                                          COMPLETED: 'text-success',
                                        },
                                      }}
                                    />
                                  }
                                />
                              </Col>
                            )}
                          </Row>
                        </Card.Body>
                        <Card.Footer className="bg-none border-0 px-md-4 px-0 mt-lg-3">
                          <RenderInformation
                            title="Selected Units"
                            html={
                              data.select_all_units ? (
                                <p className="text-capitalize">
                                  This project has been added for all units of {propertyName} property
                                </p>
                              ) : (
                                <ApiResponseWrapper
                                  {...units}
                                  showError={false}
                                  loadingComponent={
                                    <SkeletonInlineProperty aspect={false} style={{ width: 60, height: 60 }} />
                                  }
                                  renderResults={data => {
                                    return (
                                      <Row className="gx-0">
                                        <Col xl={6} lg={8} md={10} xs={12} className="border">
                                          <ListGroup className="px-3 py-2 shadow-sm" variant="flush">
                                            {data.map(u => (
                                              <ListGroup.Item key={`${u.id}`}>
                                                <ItemName
                                                  value={{
                                                    title: u.name,
                                                    subtitle: u.unit_type_name,
                                                    image: u.cover_picture ? u.cover_picture : '',
                                                  }}
                                                  preview
                                                  isThisFor="page"
                                                />
                                              </ListGroup.Item>
                                            ))}
                                          </ListGroup>
                                        </Col>
                                      </Row>
                                    );
                                  }}
                                />
                              )
                            }
                          />
                        </Card.Footer>
                      </Col>
                    </Row>
                    <RenderInformation title="Other Information" description={data.description} />
                  </Card.Body>
                </Card>
              </div>

              {project_id && (
                <div className="container-fluid page-section my-4 pb-2">
                  <Expenses project_id={project_id} />
                </div>
              )}
            </PageContainer>
          </div>
        );
      }}
    />
  );
};

export default ProjectDetails;
