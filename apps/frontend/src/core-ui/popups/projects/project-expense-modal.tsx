import { useCallback, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import {
  useCreateExpensesAttachmentsMutation,
  useCreateExpensesMutation,
  useDeleteExpensesAttachmentsMutation,
  useGetExpensesAttachmentsQuery,
  useUpdateExpensesMutation,
} from 'services/api/project-expenses';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetUserByIdQuery } from 'services/api/users';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { UsersPlusIcon } from 'core-ui/icons';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IUser } from 'interfaces/IAvatar';
import { IExpenseAttachments, IExpenses } from 'interfaces/IMaintenance';

const ExpenseSchema = Yup.object().shape({
  title: Yup.string().trim().required('This field is required!'),
  amount: Yup.number().positive().required('This field is required!'),
  assigned_to: yupFilterInput.required('This field is required!'),
  date: Yup.date().required('This field is required!'),
  old_files: Yup.array().of(Yup.object()).default([]),
  files: Yup.array()
    .of(Yup.mixed())
    .when('old_files', {
      is: (file: Array<IExpenseAttachments>) => file && file.length <= 0,
      then: schema => schema.of(Yup.mixed()),
    }),
});

interface IProps {
  update?: boolean;
  project: number | string;
  data?: IExpenses;
}

const ProjectExpenseModal = ({ data, project: project_id, update }: IProps) => {
  const {
    data: assigned_to_data,
    isLoading: assignLoading,
    isFetching: assignFetching,
  } = useGetUserByIdQuery(getIDFromObject('assigned_to', data));

  const {
    data: expense_attachments,
    isLoading: requestAttachmentsLoading,
    isFetching: requestAttachmentsFetching,
  } = useGetExpensesAttachmentsQuery(getIDFromObject('id', data));

  const [updateExpense] = useUpdateExpensesMutation();
  const [createExpense] = useCreateExpensesMutation();

  const [deletedFiles, setDeletedFiles] = useState<IExpenseAttachments[]>([]);
  const {
    setTotalFiles,
    handleUpload,
    progress,
    filesData,
    totalUploadProgress,
    totalFiles,
    totalFilesUpload,
    selectedFiles,
    setSelectedFiles,
  } = useUploader('projects', 'expenses');

  const [createExpenseAttachment] = useCreateExpensesAttachmentsMutation();
  const [deleteExpenseAttachment] = useDeleteExpensesAttachmentsMutation();

  const handleFormSubmission = async (values: IExpenses) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = data && data.id ? Number(data.id) : -1;
    const response =
      update && record_id > 0
        ? await updateExpense({ ...values, id: record_id }).unwrap()
        : await createExpense(values).unwrap();

    record_id = Number(response.id);
    const attachments = await handleAttachments(attachedFiles, record_id);
    const failedUploads = attachments.filter(result => result.error);
    await handleDeleteOldAttachments(deletedFiles);

    if (failedUploads.length <= 0) {
      return {
        data: response,
        feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
        status: 'success' as 'success' | 'warning',
      };
    }

    return {
      data: response,
      feedback: `${failedUploads.length}/${selectedFiles.length} files failed to upload. However, the record may have already been ${update ? 'updated!' : 'created!'}`,
      status: 'warning' as 'success' | 'warning',
    };
  };

  const handleAttachments = async (files: IFileInfo[], attachment__id: number) => {
    const attachments = files.map(result => ({
      name: result.name,
      file: result.unique_name,
      file_type: result.ext.toUpperCase(),
      project_expense: attachment__id,
    })) as Array<IExpenseAttachments>;

    const promises: Array<GenericMutationResult<IExpenseAttachments, 'ExpensesAttachments', IExpenseAttachments>> = [];

    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createExpenseAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IExpenseAttachments[]) => {
    const promises: Array<GenericMutationResult<IExpenseAttachments, 'ExpensesAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteExpenseAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      title: data?.title ?? '',
      date: data?.date ?? '',
      amount: data?.amount ?? '',
      assigned_to: assigned_to_data ? [assigned_to_data] : ([] as Option[]),
      old_files: expense_attachments ? expense_attachments : ([] as IExpenseAttachments[]),
      files: [] as File[],
    },
    validationSchema: ExpenseSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let assigned_to_id = 0;
      if (values.assigned_to && Array.isArray(values.assigned_to) && values.assigned_to.length > 0) {
        assigned_to_id = Number((values.assigned_to[0] as IUser).id);
      }

      const expenseData: IExpenses = {
        ...values,
        amount: Number(values.amount),
        assigned_to: assigned_to_id,
        project: project_id,
      };

      handleFormSubmission(expenseData)
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

  const {
    handleSubmit,
    touched,
    values,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleBlur,
    handleChange,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        let files = acceptedFiles;
        if (values.files && Array.isArray(values.files)) {
          const initialValue = values.files as File[];
          files = [...files, ...initialValue];
          files = files.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
        }

        setSelectedFiles(files);
        setFieldValue('files', files);
        setTotalFiles(files.length);
      }
    },
    [setFieldValue, values.files, setTotalFiles, setSelectedFiles]
  );

  const handleRemoveCurrentFiles = (file: IExpenseAttachments, current: IExpenseAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} Expense`}
      subtitle={`Fill out the information to ${update ? 'update' : 'add'} Expense`}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
      successButton={update ? 'Update' : 'Save'}
      progress={{
        total: totalFiles,
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        totalProgress: totalUploadProgress,
        show: Boolean(values.files.length > 0),
      }}
    >
      <Form.Group className="mb-3" controlId="ExpenseFormTitle">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          name="title"
          placeholder="Enter Expense name here..."
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.title && !errors.title}
          isInvalid={touched.title && !!errors.title}
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <Row className="gx-2">
        <Col md={6}>
          <GroupedField
            min="0"
            controlId="ExpenseFormAmount"
            label="Amount"
            type="number"
            placeholder="0.00"
            step={0.01}
            position="end"
            wrapperClass="mb-3"
            icon="$"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.amount && !errors.amount}
            isInvalid={touched.amount && !!errors.amount}
            error={errors.amount}
          />
        </Col>
        <Col md={6}>
          <InputDate
            name={'date'}
            minDate={new Date()}
            labelText={'Date'}
            controlId="ExpenseFormStartDate"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.date}
            onDateSelection={date => setFieldValue('date', date)}
            onBlur={() => setFieldTouched('date')}
            isValid={touched.date && !errors.date}
            isInvalid={touched.date && !!errors.date}
            error={errors.date}
          />
        </Col>
      </Row>

      <FilterPaginateInput
        model_label="authentication.User"
        name="assigned_to"
        labelText={
          <span>
            Assign To <UsersPlusIcon />
          </span>
        }
        inputProps={{
          style: {
            paddingLeft: values.assigned_to.length > 0 ? `2.5rem` : '',
          },
        }}
        controlId={`WorkOrdersFormAssignTo`}
        placeholder={`Choose a user`}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mb-3',
        }}
        selected={values.assigned_to}
        onSelectChange={(selected: Option[]) => {
          if (selected.length) {
            setFieldValue('assigned_to', selected);
          } else {
            setFieldValue('assigned_to', []);
          }
        }}
        onBlurChange={() => setFieldTouched('assigned_to', true)}
        isValid={touched.assigned_to && !errors.assigned_to}
        isInvalid={touched.assigned_to && !!errors.assigned_to}
        filterBy={['username', 'first_name', 'last_name']}
        labelKey={option => getStringPersonName(option as IUser)}
        renderMenuItemChildren={option => <ItemMenuItem option={option as IUser} />}
        renderInput={(inputProps, { selected }) => {
          const option = selected.length > 0 ? (selected[0] as IUser) : undefined;
          return <ItemInputItem {...inputProps} option={option} />;
        }}
        searchIcon={false}
        disabled={assignLoading || assignFetching}
        error={errors.assigned_to}
      />

      <div>
        <Row className="mb-4 gx-0 gy-2">
          <Col xs={12}>
            <Form.Group controlId="NotesFormAttachments">
              <Form.Label className="popup-form-labels">Attachments</Form.Label>
              <div className="ratio ratio-21x9">
                <Dropzone
                  name="files"
                  onDrop={onDrop}
                  disabled={requestAttachmentsFetching || requestAttachmentsLoading}
                  accept={FILE_TYPES_DOCS_IMAGES}
                  onError={error => setFieldError('files', error.message)}
                  maxSize={5242880}
                />
              </div>
              <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': touched.files && !!errors.files })}>
                {errors.files?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-3">
          {values.files.map(file => {
            const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
            const progressed = currentProgress && currentProgress.progress ? currentProgress.progress : 0;

            return (
              <Col key={file.name} xl={5} md={6}>
                <FileAttachments
                  onRemove={() => {
                    const remainingFiles = values.files.filter(value => value.name !== file.name);
                    setSelectedFiles(remainingFiles);
                    setFieldValue('files', remainingFiles);
                    setTotalFiles(remainingFiles.length);
                  }}
                  progress={progressed}
                  file={file}
                />
              </Col>
            );
          })}
          {values.old_files.map((file, indx) => (
            <Col key={indx} xl={5} md={6}>
              <FileAttachments onRemove={() => handleRemoveCurrentFiles(file, values.old_files)} file={file} />
            </Col>
          ))}
        </Row>
      </div>
    </Popup>
  );
};

export default ProviderHOC(ProjectExpenseModal);
