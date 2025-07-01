import { Fragment, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { useGetPropertiesQuery } from 'services/api/properties';

import { ItemName, ItemOwner } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { OccupiedIcon, VacantIcon } from 'core-ui/icons';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { PropertyStatus } from 'interfaces/IProperties';

import PropertyHeader from './property-navigation';
import PropertyWrapper from './property-wrapper';

import './properties.styles.css';

const Properties = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Property name',
      accessor: 'property',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'No. of units',
      accessor: 'total_units',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemPropertyStatus,
    },
    {
      Header: 'Owners',
      accessor: 'owners',
      Cell: ItemOwner,
    },
    {
      Header: 'Property Manager',
      accessor: 'manager',
      minWidth: 200,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <PropertyWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetPropertiesQuery}
          pageHeader={<PropertyHeader />}
          filterMenu={component}
          filterValues={{ is_occupied: filterValue }}
          newRecordButtonPermission={PERMISSIONS.PROPERTY}
          onRowClick={row => {
            if (row.values) {
              const property = row.values['property'];
              redirect(`${property.id}/details`);
            }
          }}
        />
      )}
    </PropertyWrapper>
  );
};

const ItemPropertyStatus = ({ value }: { value?: PropertyStatus }) => {
  if (!value) return <span>-</span>;

  return (
    <Stack direction="horizontal" className="cell-font-size justify-content-md-start justify-content-end" gap={2}>
      {value === 'OCCUPIED' ? (
        <Fragment>
          <OccupiedIcon />
          <span className="text-capitalize">Occupied</span>
        </Fragment>
      ) : (
        <Fragment>
          <VacantIcon />
          <span className="text-capitalize">Vacant</span>
        </Fragment>
      )}
    </Stack>
  );
};

export default Properties;
