import { Fragment, useCallback } from 'react';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetUserByIdQuery } from 'services/api/users';
import { useUpdateWorkOrderMutation } from 'services/api/work-orders';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { UsersPlusIcon } from 'core-ui/icons';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, getStringPersonName, getValidID, renderFormError } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { WorkOrderStatus } from 'interfaces/IWorkOrders';

const ProjectSchema = Yup.object().shape({
  assign_to: yupFilterInput.required('this filed is required!'),
});

declare type AssignWorkOrderType = {
  status: WorkOrderStatus;
  assign_to: number | IUser;
};

interface IProps {
  assignTo?: number;
  serviceRequest: number;
  workOrder: number | string;
}
const AssignWorkOrderModal = ({ assignTo, serviceRequest, workOrder }: IProps) => {
  const [assignWorkOrder] = useUpdateWorkOrderMutation();

  const {
    data: assign_to_data,
    isLoading: assignLoading,
    isFetching: assignFetching,
  } = useGetUserByIdQuery(getValidID(assignTo));

  const handleFormSubmission = async (values: AssignWorkOrderType) => {
    const response = await assignWorkOrder({ ...values, id: workOrder, service_request: serviceRequest }).unwrap();
    return {
      data: response,
      feedback: `Work order has been assigned`,
      status: 'success' as 'success' | 'warning',
    };
  };

  const formik = useFormik({
    initialValues: {
      assign_to: assign_to_data ? [assign_to_data] : ([] as Option[]),
    },
    validationSchema: ProjectSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let user_id = 0;
      if (values.assign_to && values.assign_to.length > 0) {
        user_id = Number((values.assign_to as Array<IUser>)[0].id);
      }

      handleFormSubmission({ assign_to: user_id, status: 'ASSIGNED' })
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({ isConfirmed: true, value: Number(result.data.id) });
        })
        .catch(err => {
          Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
          const error = err as BaseQueryError;
          if (error.status === 400 && error.data) {
            renderFormError(error.data, setFieldError);
          }
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const { handleSubmit, touched, values, setFieldValue, setFieldTouched, isSubmitting, handleReset, errors } = formik;

  const onUserSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('assign_to', selected);
      } else {
        setFieldValue('assign_to', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={`Assign Work Order`}
      subtitle={`Select a user to assign this work order to them`}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <FilterPaginateInput
        name="assign_to"
        model_label="authentication.User"
        labelText={
          <Fragment>
            Assign To <UsersPlusIcon />
          </Fragment>
        }
        inputProps={{
          style: {
            paddingLeft: values.assign_to.length > 0 ? `2.5rem` : '',
          },
        }}
        controlId={`WorkOrdersFormAssignTo`}
        placeholder={`Choose a user`}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mb-3',
        }}
        selected={values.assign_to}
        onSelectChange={onUserSelected}
        onBlurChange={() => setFieldTouched('assign_to', true)}
        isValid={touched.assign_to && !errors.assign_to}
        isInvalid={touched.assign_to && !!errors.assign_to}
        filterBy={['username', 'first_name', 'last_name']}
        labelKey={option => getStringPersonName(option as IUser)}
        renderMenuItemChildren={option => <ItemMenuItem option={option as IUser} />}
        renderInput={(inputProps, { selected }) => {
          const option = selected.length > 0 ? (selected[0] as IUser) : undefined;
          return <ItemInputItem {...inputProps} option={option} />;
        }}
        disabled={assignLoading || assignFetching}
        searchIcon={false}
        error={errors.assign_to}
      />
    </Popup>
  );
};

export default ProviderHOC(AssignWorkOrderModal);
