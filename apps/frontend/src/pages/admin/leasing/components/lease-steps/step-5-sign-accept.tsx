import { Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, useFormikContext } from 'formik';

import { RichTextEditor } from 'core-ui/text-editor';

import { ILeaseTemplateWithObjects } from 'interfaces/IApplications';

import formFields from './form-fields';

const Step05SignAccept = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILeaseTemplateWithObjects>();
  const { final_statement } = formFields.formField;

  return (
    <div>
      <div className="mb-3">
        <Form.Label htmlFor="LeasingFormSignedAndAccept" className="popup-form-labels">
          Sign & accept
        </Form.Label>
        <RichTextEditor
          minified
          height={185}
          readOnly={isDisabled}
          id="LeasingFormSignedAndAccept"
          value={values.final_statement}
          onChange={val => setFieldValue(final_statement.name, val)}
          onBlur={() => setFieldTouched(final_statement.name, true)}
          isValid={touched.final_statement && !errors.final_statement}
          isInvalid={touched.final_statement && !!errors.final_statement}
          error={<ErrorMessage className="text-danger" name={final_statement.name} component={Form.Text} />}
        />
      </div>

      <p className="popup-form-labels">Signatures</p>
      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={5} xxl={4}>
          <div className="fw-bold bg-light py-3 form-control disabled border-0">[Owner Name]</div>
        </Col>
        <Col sm={8} md={5} xxl={4}>
          <div className="fw-bold bg-light py-3 form-control disabled border-0">[Tenant Name]</div>
        </Col>
      </Row>
    </div>
  );
};

export default Step05SignAccept;
