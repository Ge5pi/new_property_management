import { Col, Form, Row } from 'react-bootstrap';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';
import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';
import { TagsInput } from 'components/tags-input';

import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { displayDate, getReadableError, isValidDate, renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { CustomOptionType } from 'interfaces/IInputs';
import { GeneralTags } from 'interfaces/ISettings';
import { ISingleUnit } from 'interfaces/IUnits';

interface IProps {
  data?: ISingleUnit;
  property?: string | number;
  updateUnitInformation?: GenericMutationTrigger<Partial<ISingleUnit>, Partial<ISingleUnit>>;
  createTag: GenericMutationTrigger<IIDName, GeneralTags>;
}

const UnitInformationSchema = Yup.object().shape({
  ready_for_show_on: Yup.date().required('This field is required!'),
  virtual_showing_available: Yup.boolean().required('This field is required!').default(false),
  utility_bills: Yup.boolean().required('This field is required!').default(false),
  utility_bills_date: Yup.date().notRequired(),
  lock_box: Yup.string().required('This field is required!'),
  description: Yup.string().required('This field is required!'),
  non_revenues_status: Yup.boolean().required('This field is required!').default(false),
  tags: Yup.array().of(Yup.object()).min(1, 'Please add at least 1 tag').required('this field is required!'),
});

const UnitInformationModal = ({ data, property, createTag, updateUnitInformation }: IProps) => {
  const handleTagCreation = async (name: string) => {
    return await createTag({ name }).then(result => {
      if (result.data) {
        return result.data;
      } else {
        const error = result.error as BaseQueryError;
        if (error.status === 400 && error.data) {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong... Please try again',
          });
        }
        throw Error('unable to create new tag');
      }
    });
  };

  const handleFormSubmission = async (values: FormikValues) => {
    if (!updateUnitInformation || !data || (data && Number(data.id) <= 0))
      return Promise.reject('Incomplete data found');

    const tags: Array<number> = [];
    const promises: Array<Promise<GeneralTags>> = [];

    (values.tags as GeneralTags[]).forEach(selected => {
      if (typeof selected !== 'string' && 'customOption' in selected) {
        promises.push(handleTagCreation((selected as CustomOptionType).name));
      } else {
        tags.push(Number(selected.id));
      }
    });

    if (promises.length > 0) {
      await Promise.all(promises).then(results => {
        results.forEach(result => tags.push(Number(result.id)));
      });
    }

    let utility_bills_date = undefined;
    if (values.utility_bills_date && values.utility_bills) {
      if (isValidDate(values.utility_bills_date)) {
        utility_bills_date = values.utility_bills_date;
      }
    }

    const obj: Partial<ISingleUnit> = {
      ...values,
      utility_bills_date,
      id: data.id,
      tags,
    };

    return await updateUnitInformation({ ...obj, parent_property: Number(property) });
  };

  const {
    data: tags_list,
    isLoading: tagsLoading,
    isFetching: tagsFetching,
  } = useGetListOfGeneralTagsQuery(data && data.tags ? data.tags : skipToken);

  const formik = useFormik({
    initialValues: {
      ready_for_show_on: data?.ready_for_show_on ?? '',
      virtual_showing_available: data?.virtual_showing_available ?? false,
      utility_bills: data?.utility_bills ?? false,
      utility_bills_date: data?.utility_bills_date ?? '',
      lock_box: data?.lock_box ?? '',
      description: data?.description ?? '',
      non_revenues_status: data?.non_revenues_status ?? false,
      tags: tags_list ? tags_list : [],
    },
    validationSchema: UnitInformationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            SwalExtended.close();
          } else {
            const error = result.error as BaseQueryError;
            if (error.status === 400 && error.data) {
              renderFormError(error.data, setFieldError);
            }
          }
        })
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup
      title={'Unit Information'}
      subtitle={'Edit the property Unit information'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col xl={6} lg={7}>
          <Form.Group
            as={Row}
            className="justify-content-start gx-0 mx-md-0 mx-sm-2 mx-1 mb-4"
            controlId="UnitInformationFormHasVirtualShow"
          >
            <Col xs={'auto'}>
              <Form.Label className="popup-form-labels">Virtual showing available</Form.Label>
            </Col>
            <Col xs={'auto'}>
              <Form.Group className="ms-3" controlId="UnitInformationFormVirtualShowYes">
                <Form.Check
                  type={'radio'}
                  label={`Yes`}
                  className="small text-primary"
                  name="virtual_showing_available"
                  onChange={() => setFieldValue('virtual_showing_available', true)}
                  onBlur={handleBlur}
                  checked={values.virtual_showing_available === true}
                  isInvalid={touched.virtual_showing_available && !!errors.virtual_showing_available}
                />
              </Form.Group>
            </Col>
            <Col xs={'auto'}>
              <Form.Group className="mx-3" controlId="UnitInformationFormVirtualShowNo">
                <Form.Check
                  type={'radio'}
                  label={`No`}
                  className="small text-primary"
                  name="virtual_showing_available"
                  onBlur={handleBlur}
                  onChange={() => setFieldValue('virtual_showing_available', false)}
                  checked={values.virtual_showing_available === false}
                  isInvalid={touched.virtual_showing_available && !!errors.virtual_showing_available}
                />
              </Form.Group>
            </Col>
            <Form.Control.Feedback type="invalid">{errors.virtual_showing_available}</Form.Control.Feedback>
          </Form.Group>
          <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0">
            <Col xs={'auto'}>
              <InputDate
                labelText={'Ready For Showing On'}
                controlId="UnitInformationFormReadyForShow"
                classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
                onDateSelection={date => setFieldValue('ready_for_show_on', date)}
                name="ready_for_show_on"
                value={values.ready_for_show_on}
                onBlur={handleBlur}
                minDate={new Date()}
                isValid={touched.ready_for_show_on && !errors.ready_for_show_on}
                isInvalid={touched.ready_for_show_on && !!errors.ready_for_show_on}
                error={errors.ready_for_show_on}
              />
            </Col>
          </Row>
          <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0">
            <Col xs={'auto'}>
              <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="UnitInformationFormUtilityBills">
                <Form.Label className="popup-form-labels">Utility Bills</Form.Label>
                <Form.Check
                  className="form-check-green"
                  type="switch"
                  label={values.utility_bills ? `Enabled` : 'Disabled'}
                  name="utility_bills"
                  onBlur={handleBlur}
                  onChange={ev => {
                    setFieldValue('utility_bills', !values.utility_bills);
                    if (ev.target.checked) {
                      setFieldValue('utility_bills_date', displayDate(new Date()));
                    } else {
                      setFieldValue('utility_bills_date', '');
                    }
                  }}
                  checked={values.utility_bills === true}
                  isInvalid={touched.utility_bills && !!errors.utility_bills}
                />
                <Form.Text className="d-block text-muted" style={{ fontSize: 'smaller' }}>
                  Enabled date: {displayDate(values.utility_bills_date)}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={'auto'}>
              <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="UnitInformationFormLockBox">
                <Form.Label className="popup-form-labels">Lock box</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter text here"
                  name="lock_box"
                  value={values.lock_box}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.lock_box && !errors.lock_box}
                  isInvalid={touched.lock_box && !!errors.lock_box}
                />
                <Form.Control.Feedback type="invalid">{errors.lock_box}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0">
            <Col>
              <Form.Group
                as={Row}
                className="justify-content-start gx-0 mx-md-0 mx-sm-2 mx-1 mb-4"
                controlId="UnitInformationFormHasNonRevenueUnit"
              >
                <Col xs={'auto'}>
                  <Form.Label className="popup-form-labels">Non revenue unit</Form.Label>
                </Col>
                <Col xs={'auto'}>
                  <Form.Group className="ms-3" controlId="UnitInformationFormNonRevenueUnitYes">
                    <Form.Check
                      type={'radio'}
                      label={`Yes`}
                      className="small text-primary"
                      name="non_revenues_status"
                      onChange={() => setFieldValue('non_revenues_status', true)}
                      onBlur={handleBlur}
                      checked={values.non_revenues_status === true}
                      isInvalid={touched.non_revenues_status && !!errors.non_revenues_status}
                    />
                  </Form.Group>
                </Col>
                <Col xs={'auto'}>
                  <Form.Group className="mx-3" controlId="UnitInformationFormNonRevenueUnitNo">
                    <Form.Check
                      type={'radio'}
                      label={`No`}
                      className="small text-primary"
                      name="non_revenues_status"
                      onChange={() => setFieldValue('non_revenues_status', false)}
                      onBlur={handleBlur}
                      checked={values.non_revenues_status === false}
                      isInvalid={touched.non_revenues_status && !!errors.non_revenues_status}
                    />
                  </Form.Group>
                </Col>
                <Form.Control.Feedback type="invalid">{errors.non_revenues_status}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="UnitInformationFormDescription">
            <Form.Label className="popup-form-labels">Description</Form.Label>
            <Form.Control
              placeholder="Some test here..."
              as="textarea"
              rows={5}
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.description && !errors.description}
              isInvalid={touched.description && !!errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xl={6} lg>
          <TagsInput
            name="tags"
            label={'Tags'}
            tags={values.tags as GeneralTags[]}
            onCreate={data => setFieldValue('tags', data)}
            isValid={touched.tags && !errors.tags}
            isInvalid={touched.tags && !!errors.tags}
            controlID={'UnitInformationFormTags'}
            onBlur={() => setFieldTouched('tags', true)}
            disabled={tagsLoading || tagsFetching}
            error={errors.tags}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(UnitInformationModal);
