import { useParams } from 'react-router-dom';

import { useGetOwnedPropertiesQuery } from 'services/api/owners';

import { ItemPercentage } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const PropertiesOwned = () => {
  const { owner: owner_id } = useParams();

  const { data = [], ...owner_list } = useGetOwnedPropertiesQuery(getValidID(owner_id));
  const columns = [
    {
      Header: 'Property Name',
      accessor: 'property_name',
      disableSortBy: true,
    },
    {
      Header: 'No. of units',
      accessor: 'number_of_units',
      disableSortBy: true,
    },
    {
      Header: 'Percentage owned',
      accessor: 'percentage_owned',
      Cell: ItemPercentage,
      disableSortBy: true,
    },
  ];

  return (
    <div className="min-h-100 border page-section pgr-white">
      <SimpleTable
        {...owner_list}
        data={data}
        shadow={false}
        showTotal={false}
        wrapperClass="detail-section-table"
        newRecordButtonPermission={PERMISSIONS.PEOPLE}
        showHeaderInsideContainer
        pageHeader={<p className="fw-bold m-0 text-primary">Properties Owned</p>}
        columns={columns}
      />
    </div>
  );
};

export default PropertiesOwned;
