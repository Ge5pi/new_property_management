import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { Formik } from 'formik';
import * as Yup from 'yup';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateManagementFeeMutation,
  useGetLatestManagementFeesQuery,
  useGetManagementFeesQuery,
} from 'services/api/system-preferences';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { ItemDate, ItemUserName } from 'components/custom-cell';
import { SubmitBtn } from 'components/submit-button';
import { TableWithPagination } from 'components/table';

import { GroupedField } from 'core-ui/grouped-field';
import { RenderInformation } from 'core-ui/render-information';

import { PERMISSIONS } from 'constants/permissions';
import { renderFormError } from 'utils/functions';

import { IManagementFee, ManagementFeeType } from 'interfaces/ISettings';

const ManagementFeeSchema = Yup.object().shape(
  {
    prev_fee: Yup.number(),
    prev_percentage: Yup.number(),
    by_percentage: Yup.number()
      .positive('Enter a valid number!')
      .when('flat_fee', {
        is: (value: string | number) => !value || value.toString().length === 0,
        then: schema => schema.required('This field is required!'),
      }),
    flat_fee: Yup.number()
      .positive('Enter a valid number!')
      .when('by_percentage', {
        is: (value: string | number) => !value || value.toString().length === 0,
        then: schema => schema.required('This field is required!'),
      }),
  },
  [['by_percentage', 'flat_fee']]
);

interface IRecentManagementFee extends IManagementFee {
  prev_fee?: number;
  prev_percentage?: number;
}

const ManagementFee = () => {
  const {
    data,
    isLoading: managementFeeLoading,
    isFetching: managementFeeFetching,
  } = useGetLatestManagementFeesQuery();
  const recent_management_fee = data && data.count > 0 ? (data.results[0] as IRecentManagementFee) : null;

  const columns = [
    {
      Header: 'Previous fee',
      accessor: 'prev_fee',
      disableSortBy: true,
    },
    {
      Header: 'Updated',
      accessor: 'updated_fee',
      disableSortBy: true,
    },
    {
      Header: 'Updated date',
      accessor: 'created_at',
      Cell: ItemDate,
      disableSortBy: true,
    },
    {
      Header: 'Updated by',
      accessor: 'created_by',
      Cell: ItemUserName,
      minWidth: 200,
      disableSortBy: true,
    },
  ];

  const [
    createManagementFee,
    { isSuccess: isCreateManagementFeeSuccess, isError: isCreateManagementFeeError, error: createManagementFeeError },
  ] = useCreateManagementFeeMutation();

  useResponse({
    isSuccess: isCreateManagementFeeSuccess,
    successTitle: 'New Management Fee Record has been added',
    isError: isCreateManagementFeeError,
    error: createManagementFeeError,
  });

  return (
    <div>
      <Card className="border mb-4">
        <Card.Header className="bg-transparent border-0 p-3">
          <h2 className="fs-6 fw-bold mb-0">Management Fee</h2>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              prev_fee: recent_management_fee ? recent_management_fee.prev_fee : '',
              prev_percentage: recent_management_fee ? recent_management_fee.prev_percentage : '',
              flat_fee: '',
              by_percentage: '',
              gl_account: '15454589 98598956 6566',
            }}
            enableReinitialize
            validationSchema={ManagementFeeSchema}
            onSubmit={(values, { setFieldError, setSubmitting }) => {
              if (values) {
                let fee = Number(values.flat_fee);
                let fee_type: ManagementFeeType = 'FLAT_FEE';

                if (fee > 0 && Number(values.prev_fee) === Number(fee)) {
                  setFieldError('flat_fee', 'please enter updated value');
                  setSubmitting(false);
                  return;
                }

                if (!fee || fee <= 0) {
                  fee = Number(values.by_percentage);
                  fee_type = 'BY_PERCENTAGE';

                  if (fee > 0 && Number(values.prev_percentage) === Number(fee)) {
                    setFieldError('by_percentage', 'please enter updated value');
                    setSubmitting(false);
                    return;
                  }
                }

                const data: IManagementFee = {
                  ...values,
                  fee_type,
                  fee,
                };

                createManagementFee(data)
                  .then(result => {
                    if ('error' in result) {
                      const error = result.error as BaseQueryError;
                      if (error.status === 400 && error.data) {
                        renderFormError(error.data, setFieldError);
                      }
                    }
                  })
                  .finally(() => setSubmitting(false));
              }
            }}
          >
            {({ handleSubmit, handleBlur, handleChange, handleReset, errors, isSubmitting, values, touched }) => (
              <Form className="text-start" noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col lg={3} sm={4}>
                    <GroupedField
                      controlId="ManagementFeeFormFlatFee"
                      label="Flat Fee"
                      min="0"
                      type="number"
                      placeholder="0.00"
                      name="flat_fee"
                      value={values.flat_fee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.flat_fee && !errors.flat_fee}
                      isInvalid={touched.flat_fee && !!errors.flat_fee}
                      disabled={
                        (touched.by_percentage && !errors.by_percentage && Boolean(values.by_percentage)) ||
                        managementFeeLoading ||
                        managementFeeFetching
                      }
                      readOnly={
                        (touched.by_percentage && !errors.by_percentage && Boolean(values.by_percentage)) ||
                        managementFeeLoading ||
                        managementFeeFetching
                      }
                      error={errors.flat_fee}
                      icon="$"
                      position="end"
                    />
                  </Col>
                  <Col lg={3} sm={4}>
                    <GroupedField
                      controlId="ManagementFeeFormByPercentage"
                      label="By Percentage"
                      min="0"
                      type="number"
                      placeholder="0.00"
                      name="by_percentage"
                      value={values.by_percentage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.by_percentage && !errors.by_percentage}
                      isInvalid={touched.by_percentage && !!errors.by_percentage}
                      error={errors.by_percentage}
                      disabled={
                        (touched.flat_fee && !errors.flat_fee && Boolean(values.flat_fee)) ||
                        managementFeeLoading ||
                        managementFeeFetching
                      }
                      readOnly={
                        (touched.flat_fee && !errors.flat_fee && Boolean(values.flat_fee)) ||
                        managementFeeLoading ||
                        managementFeeFetching
                      }
                      icon="%"
                      position="end"
                    />
                  </Col>
                </Row>

                <Row className="mt-4 justify-content-between" direction="horizontal">
                  <Col sm={'auto'}>
                    <RenderInformation title="Static GL Account" description="XXXXX_XXXXX_XXXXX" />
                  </Col>
                  <Col xs={'auto'}>
                    <Button
                      variant="light border-primary"
                      type="reset"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="px-4 py-1 me-3"
                    >
                      Reset
                    </Button>
                    <SubmitBtn variant="primary" type="submit" loading={isSubmitting} className="px-4 py-1">
                      Save changes
                    </SubmitBtn>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      <TableWithPagination
        className="m-0"
        columns={columns}
        useData={useGetManagementFeesQuery}
        filterValues={{ ordering: '-created_at' }}
        wrapperClass="border"
        newRecordButtonPermission={PERMISSIONS.SYSTEM_PREFERENCES}
        shadow={false}
        saveValueInState
        showHeaderInsideContainer
        pageHeader={<h6 className="fw-bold m-0 text-capitalize">Management fee history</h6>}
      />
    </div>
  );
};

export default ManagementFee;
