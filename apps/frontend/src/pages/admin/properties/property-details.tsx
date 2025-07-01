import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPropertyByIdQuery } from 'services/api/properties';

import { BackButton } from 'components/back-button';

import TabScrollButtons from 'core-ui/tab-scroll/tab-scroll-buttons';

import { getValidID } from 'utils/functions';

import './properties.styles.css';

const PropertyDetails = () => {
  const { property } = useParams();

  if (property && Number(property) > 0) {
    return <PropertyDetailPage />;
  }

  return null;
};

const PropertyDetailPage = () => {
  const { property } = useParams();

  const result = useGetPropertyByIdQuery(getValidID(property));

  return (
    <ApiResponseWrapper
      {...result}
      renderResults={data => {
        return (
          <div className="my-3">
            <BackButton />

            <h1 className="fw-bold h4 mt-1">{data.name}</h1>
            <div className="nav-tabs-margin-28">
              <TabScrollButtons
                tabItems={[
                  {
                    key: 'details',
                    value: 'Details',
                  },
                  {
                    key: 'units',
                    value: 'Units',
                  },
                  {
                    key: 'rentable-items',
                    value: 'Rentable Items',
                  },
                  {
                    key: 'unit-types',
                    value: 'Unit Types',
                  },
                  {
                    key: 'budget',
                    value: 'Budget',
                  },
                  {
                    key: 'marketing',
                    value: 'Marketing',
                  },
                ]}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default PropertyDetails;
