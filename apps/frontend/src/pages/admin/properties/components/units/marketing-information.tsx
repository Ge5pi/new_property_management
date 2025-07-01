import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import useResponse from 'services/api/hooks/useResponse';
import { useUpdateUnitTypesInformationMutation } from 'services/api/unit-types';

import { EditBtn } from 'core-ui/edit-button';
import { MarketingInformationModal } from 'core-ui/popups/marketing-information';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { ISingleUnitType } from 'interfaces/IUnits';

interface IProps {
  data: ISingleUnitType;
}

const MarketingInformation = ({ data }: IProps) => {
  const { property: property_id } = useParams();

  const [
    updateUnitMarketingInformation,
    { isSuccess: isUpdateMarketingInfoSuccess, isError: isUpdateMarketingInfoError, error: updateMarketingInfoError },
  ] = useUpdateUnitTypesInformationMutation();

  useResponse({
    isSuccess: isUpdateMarketingInfoSuccess,
    successTitle: 'Marketing Information successfully updated.',
    isError: isUpdateMarketingInfoError,
    error: updateMarketingInfoError,
  });

  const handleSubmitData = async (values: Partial<ISingleUnitType>) => {
    if (
      !isNaN(Number(property_id)) &&
      Number(property_id) > 0 &&
      data &&
      !isNaN(Number(data.id)) &&
      Number(data.id) > 0
    ) {
      return await updateUnitMarketingInformation({
        ...values,
        id: data.id,
        parent_property: Number(property_id),
      });
    }

    return Promise.reject('Incomplete data found');
  };

  return (
    <Card>
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Marketing Information</p>
        <EditBtn
          className="position-absolute top-0 end-0 m-2"
          permission={PERMISSIONS.PROPERTY}
          onClick={() => {
            if (property_id && data) {
              SweetAlert({
                html: <MarketingInformationModal data={data} updateDataState={handleSubmitData} />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          }}
        />
      </Card.Header>
      <Card.Body className="text-start">
        <RenderInformation title="Marketing title" description={data.marketing_title} />

        <RenderInformation title="Marketing Description" description={data.marketing_description} />

        <RenderInformation title="Youtube URL" link={data.marketing_youtube_url} />
      </Card.Body>
    </Card>
  );
};

export default MarketingInformation;
