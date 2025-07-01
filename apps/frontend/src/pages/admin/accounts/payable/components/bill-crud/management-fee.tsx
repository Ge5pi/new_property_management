import { Button, Card, ListGroup, Stack } from 'react-bootstrap';

import { Formik } from 'formik';

import { BackButton } from 'components/back-button';

import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';

const ManagementFee = () => {
  const onSubmit = () => {
    console.log('::: values');
  };

  return (
    <div>
      <Formik
        className="text-start"
        onSubmit={onSubmit}
        initialValues={{
          property: '',
          run_as_of: '',
        }}
      >
        {({ setFieldValue, setFieldTouched }) => (
          <>
            <Stack className="justify-content-between" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">Management fee ID-213</h1>
              </div>
              <div>
                <Button variant="light border-primary" className="px-4 py-1 me-3">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="px-4 py-1">
                  Save
                </Button>
              </div>
            </Stack>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 p-0 bg-transparent text-start">
                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <p className="fw-bold m-0 text-primary">Bill Details</p>
                    <p className="small">Basic Information of this bill</p>
                  </div>
                  <DeleteBtn showText />
                </Stack>
              </Card.Header>

              <Card.Body className="p-0 mt-4">
                <Stack direction="horizontal" className="gap-4">
                  <CustomSelect
                    labelText="Property"
                    onSelectChange={value => {
                      setFieldValue('property', value);
                      setFieldTouched('property', true);
                    }}
                    onBlurChange={() => {
                      setFieldTouched('property', true);
                    }}
                    name={'property'}
                    controlId="RecurringFormRepeatsPurchaseOrder"
                    options={[{ value: '1', label: 'Option 1' }]}
                    classNames={{
                      labelClass: 'popup-form-labels',
                      wrapperClass: 'mb-4',
                    }}
                  />

                  <CustomSelect
                    labelText="Run as of"
                    onSelectChange={value => {
                      setFieldValue('run_as_of', value);
                      setFieldTouched('run_as_of', true);
                    }}
                    onBlurChange={() => {
                      setFieldTouched('run_as_of', true);
                    }}
                    name={'run_as_of'}
                    controlId="RecurringFormRepeatsWorkOrder"
                    options={[{ value: '1', label: 'Option 1' }]}
                    classNames={{
                      labelClass: 'popup-form-labels',
                      wrapperClass: 'mb-4',
                    }}
                  />

                  <Button variant="primary" type="submit" className="mt-4 mb-3 px-5">
                    Search
                  </Button>
                </Stack>

                <p className="fw-bold m-0 text-primary">Fee list</p>

                <ListGroup className="px-0 w-50" variant="flush">
                  {[1, 2, 3].map(_ => (
                    <ListGroup.Item key={_}>
                      <Stack direction="horizontal" className="justify-content-between">
                        <p className="m-0">Demo fee title</p>
                        <p className="m-0 fw-medium">$ 500</p>
                      </Stack>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="mt-3">
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0 fw-semibold">Total Bill</p>
                      <p className="m-0 fw-semibold">$ 25,000</p>
                    </Stack>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default ManagementFee;
