import { useCallback } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';

import { IVendor } from 'interfaces/IPeoples';

import formFields from './form-fields';

interface GeneralDetailsProps {
  vTypeLoading?: boolean;
  vTypeFetching?: boolean;
}

const GeneralDetails = ({ vTypeFetching, vTypeLoading }: GeneralDetailsProps) => {
  const { touched, values, errors, setFieldValue, setFieldTouched } = useFormikContext<IVendor>();

  const { company_name, first_name, last_name, gl_account } = formFields;

  const onVendorTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('vendor_type', selected);
      } else {
        setFieldValue('vendor_type', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">General Details</p>
          <p className="small">Provide general information regarding the vendor</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="VendorFormFirstName">
              <Form.Label className="form-label-md">First Name</Form.Label>
              <Field
                name={first_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.first_name && !errors.first_name}
                isInvalid={touched.first_name && !!errors.first_name}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={first_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="VendorFormLastName">
              <Form.Label className="form-label-md">Last Name</Form.Label>
              <Field
                name={last_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.last_name && !errors.last_name}
                isInvalid={touched.last_name && !!errors.last_name}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={last_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-sm-4 gx-0">
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="VendorFormCompanyName">
              <Form.Label className="form-label-md">Company Name</Form.Label>
              <Field
                name={company_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.company_name && !errors.company_name}
                isInvalid={touched.company_name && !!errors.company_name}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={company_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={8} md={5} xxl={4}>
            <FilterPaginateInput
              name="vendor_type"
              model_label="people.VendorType"
              labelText="Select Vendor Type"
              controlId={`VendorsFormVendorType`}
              placeholder={`Select`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-3',
              }}
              selected={values.vendor_type as Option[]}
              onSelectChange={onVendorTypeSelected}
              onBlurChange={() => setFieldTouched('vendor_type', true)}
              isValid={touched.vendor_type && !errors.vendor_type}
              isInvalid={touched.vendor_type && !!errors.vendor_type}
              error={errors.vendor_type}
              disabled={vTypeFetching || vTypeLoading}
              labelKey={'name'}
            />
          </Col>

          <Row className="gx-sm-4 gx-0">
            <Col sm={8} md={5} xxl={4}>
              <CustomSelect
                labelText={'Select GL Account'}
                onSelectChange={value => setFieldValue(gl_account.name, value)}
                onBlurChange={() => setFieldTouched(gl_account.name, true)}
                name={gl_account.name}
                controlId="VendorFormGLAccount"
                value={values.gl_account}
                options={[{ value: '15454589 98598956 6566', label: '15454589 98598956 6566' }]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-4',
                }}
                isValid={touched.gl_account && !errors.gl_account}
                isInvalid={touched.gl_account && !!errors.gl_account}
                error={errors && errors.gl_account}
              />
            </Col>
          </Row>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default GeneralDetails;
