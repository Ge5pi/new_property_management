import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteVendorAddressMutation } from 'services/api/vendors';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';

import { PERMISSIONS } from 'constants/permissions';

import { IVendor } from 'interfaces/IPeoples';

import formFields from './form-fields';

import countries from 'data/countries.json';

interface VendorAddressProps {
  addressLoading?: boolean;
  addressFetching?: boolean;
}

const VendorAddress = ({ addressFetching, addressLoading }: VendorAddressProps) => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<IVendor>();
  const { addresses } = formFields;

  const [deleteVendorAddresses, { isError: isDeleteAddressesError, error: deleteAddressesError }] =
    useDeleteVendorAddressMutation();

  useResponse({
    isError: isDeleteAddressesError,
    error: deleteAddressesError,
  });

  const deleteAddress = (id: number | string) => {
    deleteVendorAddresses(id);
  };

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">Address</p>
          <p className="small">Provide postal address of the vendor</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <FieldArray
          name={addresses.name}
          render={arrayHelpers => (
            <div className="mb-5">
              <Fragment>
                {values.addresses &&
                  values.addresses.map((_, index) => {
                    const streetFieldName = `addresses[${index}].street_address`;
                    const cityFieldName = `addresses[${index}].city`;
                    const stateFieldName = `addresses[${index}].state`;
                    const countryFieldName = `addresses[${index}].country`;
                    const zipFieldName = `addresses[${index}].zip`;

                    return (
                      <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                        <Card.Body>
                          <Row className="gx-sm-4 gx-0">
                            <Col>
                              <Form.Group className="mb-4" controlId={streetFieldName}>
                                <Form.Label className="form-label-md">Street address</Form.Label>
                                <Field
                                  type="text"
                                  name={streetFieldName}
                                  as={Form.Control}
                                  placeholder="Type here"
                                  isInvalid={!!getIn(errors, streetFieldName) && getIn(touched, streetFieldName)}
                                  isValid={getIn(touched, streetFieldName) && !getIn(errors, streetFieldName)}
                                  disabled={addressFetching || addressLoading}
                                />
                                <ErrorMessage className="text-danger" name={streetFieldName} component={Form.Text} />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="gx-sm-4 gx-0">
                            <Col md={6} xxl={3}>
                              <CustomSelect
                                labelText={'Country'}
                                onSelectChange={value => setFieldValue(countryFieldName, value)}
                                onBlurChange={() => setFieldTouched(countryFieldName, true)}
                                name={countryFieldName}
                                controlId={countryFieldName}
                                value={_.country}
                                options={countries}
                                searchable
                                classNames={{
                                  labelClass: 'popup-form-labels',
                                  wrapperClass: 'mb-4',
                                }}
                                isInvalid={!!getIn(errors, countryFieldName) && getIn(touched, countryFieldName)}
                                isValid={getIn(touched, countryFieldName) && !getIn(errors, countryFieldName)}
                                disabled={addressFetching || addressLoading}
                                error={
                                  <ErrorMessage className="text-danger" name={countryFieldName} component={Form.Text} />
                                }
                              />
                            </Col>
                            <Col md={6} xxl={3}>
                              <Form.Group className="mb-4" controlId={cityFieldName}>
                                <Form.Label className="form-label-md">City</Form.Label>
                                <Field
                                  type="text"
                                  name={cityFieldName}
                                  as={Form.Control}
                                  placeholder="Type here"
                                  isInvalid={!!getIn(errors, cityFieldName) && getIn(touched, cityFieldName)}
                                  isValid={getIn(touched, cityFieldName) && !getIn(errors, cityFieldName)}
                                  disabled={addressFetching || addressLoading}
                                />
                                <ErrorMessage className="text-danger" name={cityFieldName} component={Form.Text} />
                              </Form.Group>
                            </Col>
                            <Col md={6} xxl={3}>
                              <Form.Group className="mb-4" controlId={stateFieldName}>
                                <Form.Label className="form-label-md">State</Form.Label>
                                <Field
                                  type="text"
                                  name={stateFieldName}
                                  as={Form.Control}
                                  placeholder="Type here"
                                  isInvalid={!!getIn(errors, stateFieldName) && getIn(touched, stateFieldName)}
                                  isValid={getIn(touched, stateFieldName) && !getIn(errors, stateFieldName)}
                                  disabled={addressFetching || addressLoading}
                                />
                                <ErrorMessage className="text-danger" name={stateFieldName} component={Form.Text} />
                              </Form.Group>
                            </Col>
                            <Col md={6} xxl={3}>
                              <Form.Group className="mb-4" controlId={zipFieldName}>
                                <Form.Label className="form-label-md">Zip code</Form.Label>
                                <Field
                                  type="text"
                                  name={zipFieldName}
                                  as={Form.Control}
                                  placeholder="Type here"
                                  isInvalid={!!getIn(errors, zipFieldName) && getIn(touched, zipFieldName)}
                                  isValid={getIn(touched, zipFieldName) && !getIn(errors, zipFieldName)}
                                  disabled={addressFetching || addressLoading}
                                />
                                <ErrorMessage className="text-danger" name={zipFieldName} component={Form.Text} />
                              </Form.Group>
                            </Col>
                          </Row>

                          {index > 0 && (
                            <DeleteBtn
                              disabled={addressFetching || addressLoading}
                              permission={PERMISSIONS.PEOPLE}
                              onClick={() => {
                                _.id && deleteAddress(_.id);
                                arrayHelpers.remove(index);
                              }}
                            />
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
              </Fragment>
              <AddBtn
                permission={PERMISSIONS.PEOPLE}
                disabled={addressFetching || addressLoading}
                onClick={() => {
                  arrayHelpers.push({
                    [addresses.street_address.name]: '',
                    [addresses.country.name]: '',
                    [addresses.city.name]: '',
                    [addresses.state.name]: '',
                    [addresses.zip.name]: '',
                  });
                }}
              />
            </div>
          )}
        />
      </Card.Body>
    </Card>
  );
};

export default VendorAddress;
