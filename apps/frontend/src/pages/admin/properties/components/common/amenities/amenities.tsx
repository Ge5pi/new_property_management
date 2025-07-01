import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { EditBtn } from 'core-ui/edit-button';
import { AmenitiesModal } from 'core-ui/popups/amenities';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { IAmenities } from 'interfaces/IGeneral';
import { ISingleProperty } from 'interfaces/IProperties';
import { ISingleUnitType } from 'interfaces/IUnits';

interface IProps {
  from: 'properties' | 'unit-types';
  data: ISingleProperty | ISingleUnitType;
}

const Amenities = ({ data, from = 'properties' }: IProps) => {
  const { property: property_id } = useParams();

  return (
    <Card className="min-h-100">
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Amenities</p>
        <EditBtn
          className="position-absolute top-0 end-0 m-2"
          permission={PERMISSIONS.PROPERTY}
          onClick={() => {
            SweetAlert({
              html: <AmenitiesModal data={data} variant={from} parent={Number(property_id)} id={data.id} />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
        />
      </Card.Header>
      <Card.Body className="text-start px-0">
        <AmenitiesData data={data} />
      </Card.Body>
    </Card>
  );
};

interface IAmenitiesData {
  data: IAmenities;
}

const AmenitiesData = ({ data }: IAmenitiesData) => {
  return (
    <div className="text-primary">
      <div className="fw-medium amenities">
        <span className="text-truncate">Cats allowed</span>
        <span>{data.is_cat_allowed ? 'Yes' : 'No'}</span>
      </div>

      <div className="fw-medium amenities">
        <span className="text-truncate">Dogs allowed</span>
        <span>{data.is_dog_allowed ? 'Yes' : 'No'}</span>
      </div>

      <div className="fw-medium amenities">
        <span className="text-truncate">Smoking allowed</span>
        <span>{data.is_smoking_allowed ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
};

export default Amenities;
