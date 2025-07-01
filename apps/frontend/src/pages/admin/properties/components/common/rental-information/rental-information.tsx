import { Card } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetUnitTypeByIdQuery } from 'services/api/unit-types';

import { EditBtn } from 'core-ui/edit-button';
import { RentalInformationModal } from 'core-ui/popups/rental-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { ISingleUnit, ISingleUnitType, IUnitTypeIndependentFields } from 'interfaces/IUnits';

import RentalInformationData from './rental-information-data';

interface IProps extends IUnitTypeIndependentFields {
  unit_type_id: string | number;
  rental_information_for: 'UNIT_TYPE' | 'UNIT';
  onRentalInformationUpdate: (data: Partial<ISingleUnitType> | Partial<ISingleUnit>) => Promise<
    | {
        data: ISingleUnitType | ISingleUnit;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
}

const RentalInformation = ({ unit_type_id, rental_information_for, onRentalInformationUpdate, ...rest }: IProps) => {
  const unitType = useGetUnitTypeByIdQuery(getValidID(unit_type_id));

  return (
    <Card className="min-h-100">
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Rental Information</p>
        <EditBtn
          className="position-absolute top-0 end-0 m-2"
          permission={PERMISSIONS.PROPERTY}
          onClick={() => {
            if (unitType.data && unitType.data.id) {
              SweetAlert({
                size: rental_information_for === 'UNIT' ? 'lg' : 'xl',
                html: (
                  <RentalInformationModal
                    data={unitType.data}
                    updateDataState={onRentalInformationUpdate}
                    rental_information_for={rental_information_for}
                  />
                ),
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          }}
        />
      </Card.Header>
      <ApiResponseWrapper
        {...unitType}
        showMiniError
        renderIfNoResult={false}
        renderResults={unit_type => <RentalInformationData {...rest} unit_type={unit_type} />}
      />
    </Card>
  );
};

export default RentalInformation;
