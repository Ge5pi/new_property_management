import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { searchWithoutPagination } from 'api/core';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';

import { FilterInput } from 'core-ui/custom-select';
import { InputDate } from 'core-ui/input-date';
import { RichTextEditor } from 'core-ui/text-editor';

// import { TextEditor } from 'core-ui/text-editor';
import { FILE_ALL_TYPES } from 'constants/file-types';

import { AnnouncementSelection, IAnnouncementAttachments, ISingleAnnouncement } from 'interfaces/ICommunication';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

import formFields from './form-fields';

interface IFormInputValues extends ISingleAnnouncement {
  is_all_units?: boolean;
  is_all_properties?: boolean;
  is_selective_units?: boolean;
  is_selective_properties?: boolean;
  old_files: IAnnouncementAttachments[];
  properties: Array<IPropertyAPI>;
  units: Array<IUnitsAPI>;
  files: File[];
}

interface IProps {
  loadingAttachments?: boolean;
  loadingProperties?: boolean;
  loadingUnits?: boolean;
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  setDeletedFiles: Dispatch<SetStateAction<IAnnouncementAttachments[]>>;
}

const Step01Details = ({
  loadingAttachments,
  loadingUnits,
  loadingProperties,
  setDeletedFiles,
  setSelectedFiles,
}: IProps) => {
  const { touched, errors, values, setFieldValue, handleBlur, handleChange, setFieldTouched, setFieldError } =
    useFormikContext<IFormInputValues>();
  const {
    title,
    is_all_properties,
    is_all_units,
    is_selective_properties,
    is_selective_units,
    properties,
    units,
    display_date,
    display_on_portal,
    expiry_date,
    is_send_email,
    body,
  } = formFields;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        let aFiles = acceptedFiles;
        if (values.files && Array.isArray(values.files)) {
          const initialValue = values.files as File[];
          aFiles = [...aFiles, ...initialValue];
          aFiles = aFiles.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
        }

        setSelectedFiles(aFiles);
        setFieldValue('files', aFiles);
      }
    },
    [setFieldValue, values.files, setSelectedFiles]
  );

  const handleRemoveCurrentFiles = (file: IAnnouncementAttachments, current: IAnnouncementAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  const [propertiesList, setProperties] = useState<Array<IPropertyAPI>>([]);
  const handleProperties = (query: string) => {
    searchWithoutPagination('property.Property', query).then(res => setProperties(res.data));
  };

  const onPropertySelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IPropertyAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index === self.findIndex(t => t.name.toLowerCase().trim() === value.name.toLowerCase().trim())
        );
        setFieldValue('properties', selection);
      } else {
        setFieldValue('properties', []);
      }

      setUnits([]);
      setFieldValue('unit', []);
    },
    [setFieldValue]
  );

  const selected_properties = useMemo(() => {
    if (values.properties && Array.isArray(values.properties) && values.properties.length > 0) {
      return values.properties.map(prop => Number((prop as IPropertyAPI).id));
    }
  }, [values.properties]);

  const selectedCategory = useMemo(() => {
    const is_selective_units = values.is_selective_units;
    const is_selective_properties = values.is_selective_properties;
    const is_all_units = values.is_all_units;
    const is_all_properties = values.is_all_properties;

    let selection: AnnouncementSelection = 'APAU';
    if (is_selective_properties && is_all_units) {
      selection = 'SPAU';
    } else if (is_selective_properties && is_selective_units) {
      selection = 'SPSU';
    } else if (is_all_properties && is_selective_units) {
      selection = 'APSU';
    }

    return selection;
  }, [values.is_selective_units, values.is_all_properties, values.is_selective_properties, values.is_all_units]);

  const [unitsList, setUnits] = useState<Array<IUnitsAPI>>([]);
  const handleUnitSearch = (query: string) => {
    if (selectedCategory === 'APSU') {
      searchWithoutPagination('property.Unit', query).then(res => setUnits(res.data));
      return;
    }

    if (selectedCategory === 'SPSU') {
      if (selected_properties && selected_properties.length) {
        const promises = selected_properties.map(id =>
          searchWithoutPagination('property.Unit', query, { key: 'parent_property', id })
        );
        Promise.all(promises).then(responses => {
          const res = responses.flatMap(re => re.data as IUnitsAPI);
          setUnits(res);
        });
      }
    }
  };

  const onUnitSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IUnitsAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index === self.findIndex(t => t.name.toLowerCase().trim() === value.name.toLowerCase().trim())
        );
        setFieldValue('units', selection);
      } else {
        setFieldValue('units', []);
      }
    },
    [setFieldValue]
  );

  return (
    <div>
      <Row className="gx-sm-4 gy-3 gx-0">
        <Col md={5}>
          <Row className="gx-sm-4 gy-3 gx-0">
            <Col md={12}>
              <Form.Group className="mb-4" controlId="AnnouncementFormTitle">
                <Form.Label className="form-label-md">Announcement Title</Form.Label>
                <Field
                  autoFocus
                  type="text"
                  name={title.name}
                  as={Form.Control}
                  isValid={touched.title && !errors.title}
                  isInvalid={touched.title && !!errors.title}
                  placeholder="Type here"
                />
                <ErrorMessage className="text-danger" name={title.name} component={Form.Text} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <div className="form-label-md">Properties</div>
              <Stack direction="horizontal" gap={5} className="mb-1">
                <Form.Group controlId="AnnouncementFormAllProperties">
                  <Form.Check
                    type="checkbox"
                    label="For all"
                    className="small text-primary"
                    name={is_all_properties.name}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_selective_properties.name, false);
                        setFieldValue(properties.name, []);
                      }
                    }}
                    onChange={handleChange}
                    checked={values.is_all_properties}
                    isInvalid={touched.is_all_properties && !!errors.is_all_properties}
                    onBlur={handleBlur}
                  />
                </Form.Group>
                <Form.Group controlId="AnnouncementFormSelectiveProperties">
                  <Form.Check
                    type="checkbox"
                    label="Selective"
                    className="small text-primary"
                    name={is_selective_properties.name}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_all_properties.name, false);
                      }
                    }}
                    onChange={handleChange}
                    checked={values.is_selective_properties}
                    isInvalid={touched.is_selective_properties && !!errors.is_selective_properties}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Stack>
              <FilterInput
                multiple
                size="sm"
                name={properties.name}
                placeholder={`Search for properties`}
                controlId={`AnnouncementFormProperties`}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
                options={propertiesList}
                selected={values.properties}
                onSelectChange={onPropertySelected}
                onBlurChange={() => setFieldTouched(properties.name, true)}
                isValid={touched.properties && !errors.properties}
                isInvalid={touched.properties && !!errors.properties}
                labelKey={`name`}
                searchIcon={false}
                onSearch={handleProperties}
                error={errors.properties}
                disabled={values.is_all_properties || loadingProperties || Boolean(errors.is_selective_properties)}
              />
            </Col>
            <Col md={12}>
              <div className="form-label-md">Units</div>
              <Stack direction="horizontal" gap={5} className="mb-1">
                <Form.Group controlId="AnnouncementFormAllUnits">
                  <Form.Check
                    type="checkbox"
                    label="For all"
                    className="small text-primary"
                    name={is_all_units.name}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_selective_units.name, false);
                        setFieldValue(units.name, []);
                      }
                    }}
                    onChange={handleChange}
                    checked={values.is_all_units}
                    isInvalid={touched.is_all_units && !!errors.is_all_units}
                    onBlur={handleBlur}
                  />
                </Form.Group>
                <Form.Group controlId="AnnouncementFormSelectiveUnits">
                  <Form.Check
                    type="checkbox"
                    label="Selective"
                    className="small text-primary"
                    name={is_selective_units.name}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_all_units.name, false);
                      }
                    }}
                    onChange={handleChange}
                    checked={values.is_selective_units}
                    isInvalid={touched.is_selective_units && !!errors.is_selective_units}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Stack>

              <FilterInput
                multiple
                size="sm"
                name={units.name}
                placeholder={`Search for units`}
                controlId={`AnnouncementFormUnits`}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
                options={unitsList}
                selected={values.units}
                onSelectChange={onUnitSelected}
                onBlurChange={() => setFieldTouched(units.name, true)}
                isValid={touched.units && !errors.units}
                isInvalid={touched.units && !!errors.units}
                labelKey={`name`}
                searchIcon={false}
                onSearch={handleUnitSearch}
                error={errors.units || errors.is_all_units || errors.is_selective_units}
                disabled={
                  values.is_all_units ||
                  loadingUnits ||
                  (values.is_selective_properties && values.properties.length <= 0) ||
                  Boolean(errors.is_selective_units)
                }
              />
            </Col>
            <Col md={12}>
              <Dropzone
                name="files"
                onDrop={onDrop}
                disabled={loadingAttachments}
                className="mt-2"
                onError={error => setFieldError('files', error.message)}
                styles={{ minHeight: 95 }}
                accept={FILE_ALL_TYPES}
                maxSize={2e7}
              />
              {errors.files && <p className="text-danger">{errors.files.toString()}</p>}
            </Col>
          </Row>
          <Row>
            {values.files.map(file => {
              return (
                <Col key={file.name} xxl={5} xl={6} lg={5} md={6}>
                  <FileAttachments
                    onRemove={() => {
                      const remainingFiles = values.files.filter(value => value.name !== file.name);
                      setFieldValue('files', remainingFiles);
                      setSelectedFiles(remainingFiles);
                    }}
                    file={file}
                  />
                </Col>
              );
            })}
            {values.old_files.map((file, indx) => (
              <Col key={indx} xxl={5} xl={6} lg={5} md={6}>
                <FileAttachments onRemove={() => handleRemoveCurrentFiles(file, values.old_files)} file={file} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={7}>
          <Row className="gx-sm-3 gy-3 gx-0">
            <Col md={12}>
              <Form.Group controlId="AnnouncementFormBody" className="mb-4">
                <Form.Label className="popup-form-labels">Body</Form.Label>
                <RichTextEditor
                  height={340}
                  id="AnnouncementFormBody"
                  value={values.body}
                  onChange={val => setFieldValue(body.name, val)}
                  onBlur={() => setFieldTouched(body.name, true)}
                  isValid={touched.body && !errors.body}
                  isInvalid={touched.body && !!errors.body}
                  error={errors.body}
                />
              </Form.Group>
            </Col>
            <Col md={12} xxl={4}>
              <div className="popup-form-labels">Other options</div>
              <Form.Group controlId="AnnouncementFormSendEmail" className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Send by email"
                  className="small text-primary"
                  name={is_send_email.name}
                  onChange={handleChange}
                  checked={values.send_by_email}
                  isInvalid={touched.send_by_email && !!errors.send_by_email}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group controlId="AnnouncementFormDisplayOnPortal" className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Display on tenant portal"
                  className="small text-primary"
                  name={display_on_portal.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={values.display_on_tenant_portal}
                  isInvalid={touched.display_on_tenant_portal && !!errors.display_on_tenant_portal}
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} xxl={4}>
              <InputDate
                labelText={'Display Date'}
                controlId={'AnnouncementFormDisplayDate'}
                classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                onDateSelection={date => setFieldValue(display_date.name, date)}
                onBlur={handleBlur}
                name={display_date.name}
                value={values.display_date}
                minDate={new Date()}
                isInvalid={!!(touched.display_date && errors && errors.display_date)}
                isValid={!!(touched.display_date && errors && !errors.display_date)}
                error={<ErrorMessage className="text-danger" name={display_date.name} component={Form.Text} />}
              />
            </Col>
            <Col lg={5} md={6} xxl={4}>
              <InputDate
                labelText={'Expiry Date'}
                controlId={'AnnouncementFormExpiryDate'}
                classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                onDateSelection={date => setFieldValue(expiry_date.name, date)}
                onBlur={handleBlur}
                name={expiry_date.name}
                value={values.expiry_date}
                minDate={new Date(values.display_date)}
                isInvalid={!!(touched.expiry_date && errors && errors.expiry_date)}
                isValid={!!(touched.expiry_date && errors && !errors.expiry_date)}
                error={<ErrorMessage className="text-danger" name={expiry_date.name} component={Form.Text} />}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Step01Details;
