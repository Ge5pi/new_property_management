import { Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { CustomSelect } from 'core-ui/custom-select';
import { InputDate } from 'core-ui/input-date';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

interface IProps {
  isDisabled?: boolean;
}

const Step01General = ({ isDisabled = false }: IProps) => {
  const { touched, errors, values, handleBlur, setFieldTouched, setFieldValue } =
    useFormikContext<IRentalFormContactDetails>();

  const { desired_move_in_date, legal_first_name, legal_last_name, middle_name, application_type } =
    formFields.formField;

  return (
    <div>
      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={5} xxl={4}>
          <InputDate
            disabled={isDisabled}
            labelText={'Desired move in date'}
            controlId={'GeneralFormMovedInDate'}
            classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
            onDateSelection={date => setFieldValue(desired_move_in_date.name, date)}
            value={values.desired_move_in_date}
            onBlur={handleBlur}
            minDate={new Date()}
            name={desired_move_in_date.name}
            isValid={touched.desired_move_in_date && !errors.desired_move_in_date}
            isInvalid={touched.desired_move_in_date && !!errors.desired_move_in_date}
            error={errors.desired_move_in_date}
          />
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={5} xxl={4}>
          <Form.Group className="mb-4" controlId="GeneralFormFirstName">
            <Form.Label className="form-label-md">Legal First Name</Form.Label>
            <Field
              disabled={isDisabled}
              name={legal_first_name.name}
              type="text"
              as={Form.Control}
              placeholder="Type here"
              isValid={touched.legal_first_name && !errors.legal_first_name}
              isInvalid={touched.legal_first_name && !!errors.legal_first_name}
            />
            <ErrorMessage className="text-danger" name={legal_first_name.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col sm={8} md={5} xxl={4}>
          <Form.Group className="mb-4" controlId="GeneralFormMiddleName">
            <Form.Label className="form-label-md">Middle Name</Form.Label>
            <Field
              disabled={isDisabled}
              name={middle_name.name}
              type="text"
              as={Form.Control}
              placeholder="Type here"
              isValid={touched.middle_name && !errors.middle_name}
              isInvalid={touched.middle_name && !!errors.middle_name}
            />
            <ErrorMessage className="text-danger" name={middle_name.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col sm={8} md={5} xxl={4}>
          <Form.Group className="mb-4" controlId="GeneralFormLastName">
            <Form.Label className="form-label-md">Legal Last Name</Form.Label>
            <Field
              disabled={isDisabled}
              name={legal_last_name.name}
              type="text"
              as={Form.Control}
              placeholder="Type here"
              isValid={touched.legal_last_name && !errors.legal_last_name}
              isInvalid={touched.legal_last_name && !!errors.legal_last_name}
            />
            <ErrorMessage className="text-danger" name={legal_last_name.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={5} xxl={4}>
          <CustomSelect
            disabled={isDisabled}
            labelText="Applicant Type"
            onSelectChange={value => setFieldValue(application_type.name, value)}
            onBlurChange={() => {
              setFieldTouched(application_type.name, true);
            }}
            name={application_type.name}
            value={values.application_type}
            controlId="GeneralFormType"
            options={[
              { value: 'FINANCIALlY_INDEPENDENT', label: 'Financially Independent' },
              { value: 'DEPENDENT', label: 'Dependent' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-4',
            }}
            isValid={touched.application_type && !errors.application_type}
            isInvalid={touched.application_type && !!errors.application_type}
            error={errors?.application_type}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Step01General;
