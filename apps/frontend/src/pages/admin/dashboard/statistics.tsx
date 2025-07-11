import { Fragment, useState } from 'react';
import { Badge, Card, Col, Container, FormSelect, ProgressBar, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';
import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetDashboardStatisticsQuery, useGetUpcomingActivitiesQuery } from 'services/api/dashboard';

import Skeleton, { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { BoxIcon, PeoplesIcon, PropertiesIcon } from 'core-ui/icons';
import { Avatar } from 'core-ui/user-avatar';

import { useAuthState } from 'hooks/useAuthState';

import { PERMISSIONS } from 'constants/permissions';
import { calculatePercentage, displayDate, parseTime } from 'utils/functions';

// ИНТЕРФЕЙС ТЕПЕРЬ СООТВЕТСТВУЕТ ДАННЫМ С БЭКЕНДА
interface IDashboardStatistics {
    units: {
        total: number;
        occupied: number;
        vacant: number;
        occupancy_percentage: string;
    };
    people: {
        owners: number;
        tenants: number;
        vendors: number;
        users: number;
    };
    properties: {
        total: number;
        complete_occupied: number;
        partial_occupied: number;
        vacant: number;
    };
}

// ФУНКЦИЯ ОБНОВЛЕНА ДЛЯ РАБОТЫ С НОВОЙ СТРУКТУРОЙ ДАННЫХ
const returnStatisticsData = (data: IDashboardStatistics) => {
  return [
    {
      id: 'total-units',
      heading: 'Total Units',
      value: data.units.total ?? 0,
      icon: <BoxIcon />,
      items: [
        {
          id: 'no-of-vacant-units',
          heading: 'No. of vacant units',
          value: data.units.vacant ?? 0,
        },
        {
          id: 'no-of-occupied-units',
          heading: 'No. of occupied units',
          value: data.units.occupied ?? 0,
        },
        {
          id: 'occupancy',
          heading: 'Occupancy %',
          className: 'percentage-symbol me-3',
          value: data.units.occupancy_percentage ?? '0.00',
        },
      ],
    },
    {
      id: 'total-vendors',
      heading: 'Total Vendors',
      value: data.people.vendors ?? 0,
      icon: <PeoplesIcon width={45} height={49.5} />,
      items: [
        {
          id: 'tenants',
          heading: 'Tenants',
          value: data.people.tenants,
        },
        {
          id: 'owners',
          heading: 'Owners',
          value: data.people.owners,
        },
        {
          id: 'users',
          heading: 'Users',
          value: data.people.users,
        },
      ],
    },
    {
      id: 'total-properties',
      heading: 'Total Properties',
      value: data.properties.total ?? 0,
      icon: <PropertiesIcon width={42} height={45.6} />,
      items: [
        {
          id: 'completed-occupied',
          heading: 'Complete occupied',
          value: data.properties.complete_occupied,
        },
        {
          id: 'partial-occupied',
          heading: 'Partial occupied',
          value: data.properties.partial_occupied,
        },
        {
          id: 'vacant-properties',
          heading: 'Vacant',
          value: data.properties.vacant,
        },
      ],
    },
  ];
};

declare type UpcomingActivityTypes = 'properties' | 'units' | 'tenants' | 'owners' | '';

function Statistics() {
  const { isAccessible } = useAuthState();
  const dashboardStatistics = useGetDashboardStatisticsQuery();
  const [selected, onSelect] = useState<UpcomingActivityTypes>(() => {
    if (isAccessible(PERMISSIONS.PROPERTY)) return 'properties';
    if (isAccessible(PERMISSIONS.TENANT)) return 'tenants';
    return '';
  });
  const upcomingActivities = useGetUpcomingActivitiesQuery(selected !== '' ? selected : skipToken);

  return (
    <div>
      <Row className="g-sm-2 gy-4">
        <Col xs={12}>
          <h1 className="fw-bold h4 mt-1 text-capitalize">Statistics</h1>
        </Col>
        <ApiResponseWrapper
          {...dashboardStatistics}
          showError={false}
          hideIfNoResults
          loadingComponent={[1, 2, 3].map(item => (
            <Col xxl={3} lg={4} md={6} key={item}>
              <Container fluid className="p-4 bg-white">
                <div className="my-3">
                  <InformationSkeleton skeletonType="user" />
                </div>
                <InlineSkeleton xs={12} size="sm" bg="placeholder" className="my-4" />
                {['a', 'b', 'c'].map(i => (
                  <div className="mb-3" key={i}>
                    <Stack direction="horizontal" className="justify-content-between">
                      <InlineSkeleton xs={4} bg="placeholder" />
                      <InlineSkeleton xs={1} bg="placeholder" />
                    </Stack>
                    <Skeleton xs={12} bg="placeholder" />
                  </div>
                ))}
              </Container>
            </Col>
          ))}
          renderResults={data => {
            const statisticsData = returnStatisticsData(data);
            return (
              <Fragment>
                {statisticsData.map(({ id, heading, icon, value, items }) => (
                  <Col key={id} xxl={3} lg={4} sm={6}>
                    <div className="page-section min-h-100">
                      <Stack direction="horizontal" className="align-items-center p-4">
                        {icon}
                        <div className="ms-4">
                          <p className="text-gray fw-medium mb-1">{heading}</p>
                          <p className="text-gray fw-bold fs-4 text-primary m-0">{value}</p>
                        </div>
                      </Stack>
                      <hr className="table-group-divider opacity-100 m-0 mt-1" />
                      {items.map(({ id: item_id, heading: item_heading, value: item_value, className }) => {
                        const calculate_percentage = [
                          'no-of-vacant-units',
                          'no-of-occupied-units',
                          'completed-occupied',
                          'partial-occupied',
                          'vacant-properties',
                        ].includes(item_id);

                        const item_percentage = calculate_percentage
                          ? calculatePercentage(Number(item_value), value)
                          : item_value;

                        return (
                          <Fragment key={item_id}>
                            <Stack direction="horizontal" className="justify-content-between px-2 py-3 pb-2">
                              <p className="m-0 small">{item_heading}</p>
                              <p className={clsx('m-0 fw-bold small', className)}>{item_value}</p>
                            </Stack>
                            {id === 'total-vendors' ? (
                              <div className="progress" style={{ height: 4 }}></div>
                            ) : (
                              <ProgressBar now={Number(item_percentage)} variant="info" style={{ height: 4 }} />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </Col>
                ))}
              </Fragment>
            );
          }}
        />
        <Col xxl={3} lg={4} sm={6}>
          {Boolean(isAccessible(PERMISSIONS.PROPERTY) || isAccessible(PERMISSIONS.PEOPLE)) && (
            <Card className="page-section min-h-100 px-3 py-2">
              <Card.Header className="border-0 bg-transparent p-1">
                <Stack direction="horizontal" gap={1} className="align-items-center justify-content-between">
                  <p className="fw-bold m-0 x-small">Upcoming Activities</p>
                  <FormSelect
                    size="sm"
                    id="filterUpcomingActivities"
                    className="bg-transparent x-small p-1"
                    onChange={ev => onSelect(ev.target.value as UpcomingActivityTypes)}
                    style={{ width: 100 }}
                    value={selected}
                  >
                    {isAccessible(PERMISSIONS.PROPERTY) && (
                      <Fragment>
                        <option className="x-small" value={'properties'}>
                          Properties
                        </option>
                        <option className="x-small" value={'units'}>
                          Units
                        </option>
                      </Fragment>
                    )}

                    {isAccessible(PERMISSIONS.PEOPLE) && (
                      <Fragment>
                        <option className="x-small" value={'tenants'}>
                          Tenants
                        </option>
                        <option className="x-small" value={'owners'}>
                          Owners
                        </option>
                      </Fragment>
                    )}
                  </FormSelect>
                </Stack>
              </Card.Header>
              <ApiResponseWrapper
                {...upcomingActivities}
                showMiniError
                loadingComponent={
                  <div className="bg-white">
                    {['a', 'b', 'c'].map(i => (
                      <div className="my-3" key={i}>
                        <InformationSkeleton skeletonType="user" />
                        <Stack direction="horizontal" className="mt-2 justify-content-between">
                          <InlineSkeleton xs={3} bg="placeholder" />
                          <InlineSkeleton xs={4} bg="placeholder" />
                        </Stack>
                        <InlineSkeleton xs={12} size="sm" bg="placeholder" />
                      </div>
                    ))}
                  </div>
                }
                renderResults={data => (
                  <Fragment>
                    <Card.Body className="p-1">
                      {data.results.length <= 0 ? (
                        <div className="text-center text-muted x-small">No Result Found</div>
                      ) : (
                        data.results.map(item => (
                          <div key={item.id} className="border-bottom border-2 last-border-0 py-2">
                            <div>
                              <Stack
                                direction="horizontal"
                                gap={1}
                                className="flex-wrap justify-content-between align-items-center"
                              >
                                <Avatar
                                  name={
                                    item.assign_to_first_name && item.assign_to_last_name
                                      ? `${item.assign_to_first_name} ${item.assign_to_last_name}`
                                      : (item.assign_to_username ?? '*')
                                  }
                                  size={30}
                                  suffixClassName="small"
                                  showName
                                />
                                <div className="x-small">
                                  <Badge pill bg="transparent" className="border border-primary text-primary border-1">
                                    {item.label_name}
                                  </Badge>
                                </div>
                              </Stack>
                            </div>
                            <div className="x-small">
                              <div className="d-flex align-items-center flex-wrap">
                                {(item.start_time || item.end_time) && (
                                  <p className="m-0 text-primary">
                                    {parseTime(item.start_time)}
                                    {item.end_time ? ` - ${parseTime(item.end_time)}` : ''}
                                  </p>
                                )}
                                <hr className="vertical-rule mx-2" style={{ height: 16 }} />
                                <p className="m-0 text-danger">{displayDate(item.date)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                    <Card.Footer className="p-1 bg-transparent text-center">
                      <Link className="btn btn-link p-0 btn-sm link-primary x-small" to={'/admin/calendar/'}>
                        view all
                      </Link>
                    </Card.Footer>
                  </Fragment>
                )}
              />
            </Card>
          )}
        </Col>
        <Col xs={12}>
          <hr className="my-4" />
        </Col>
      </Row>
    </div>
  );
}

export default Statistics;