import { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { clsx } from 'clsx';
import { useFormik } from 'formik';

import {
  useCreateNoteAttachmentsMutation,
  useCreateNoteMutation,
  useDeleteNoteAttachmentsMutation,
  useGetNoteAttachmentsQuery,
  useUpdateNoteMutation,
} from 'services/api/notes';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useCreateGeneralTagMutation, useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';
import { TagsInput } from 'components/tags-input';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, isPositiveNumber, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { INoteAPI, INoteAttachments, ISingleNote } from 'interfaces/ICommunication';
import { IPropertyAPI } from 'interfaces/IProperties';
import { GeneralTags } from 'interfaces/ISettings';

import formFields from './components/notes-form/form-fields';
import formValidation from './components/notes-form/form-validation';

interface IProps {
  note?: ISingleNote;
  update?: boolean;
}

declare type NotesFormValues = Omit<INoteAPI, 'tags'> & {
  tags: GeneralTags[];
};

const NotesCRUD = ({ note, update }: IProps) => {
  const { redirect } = useRedirect();
  const { title, description, associated_to, tags: tag_input } = formFields;
  const [deletedFiles, setDeletedFiles] = useState<INoteAttachments[]>([]);
  const { selectedFiles, setSelectedFiles, handleUpload, progress, filesData, isUploading } = useUploader('notes');

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  const [createNoteAttachment] = useCreateNoteAttachmentsMutation();
  const [deleteNoteAttachment] = useDeleteNoteAttachmentsMutation();

  const [createTag] = useCreateGeneralTagMutation();

  const {
    data: single_property,
    isLoading: singlePropLoading,
    isFetching: singlePropFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('associated_property', note));

  const {
    data: note_attachments,
    isLoading: noteAttachmentsLoading,
    isFetching: noteAttachmentsFetching,
  } = useGetNoteAttachmentsQuery(getIDFromObject('id', note));

  const {
    data: tags_list,
    isLoading: tagsLoading,
    isFetching: tagsFetching,
  } = useGetListOfGeneralTagsQuery(note && note.tags ? note.tags : skipToken);

  const handleTagCreation = async (tags: GeneralTags[]) => {
    const tagsIds: Array<number> = [];
    const promises: Array<Promise<GeneralTags>> = [];
    tags.forEach(selected => {
      if (typeof selected !== 'string' && 'customOption' in selected) {
        promises.push(createTag({ name: selected.name }).unwrap());
      } else {
        tagsIds.push(Number(selected.id));
      }
    });

    if (promises.length > 0) {
      return await Promise.all(promises).then(results => {
        results.forEach(result => tagsIds.push(Number(result.id)));
        return tagsIds;
      });
    }

    return tagsIds;
  };

  const handleFormSubmission = async (values: NotesFormValues) => {
    const tags = await handleTagCreation(values.tags);

    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = note && note.id ? Number(note.id) : -1;
    const response =
      update && record_id > 0
        ? await updateNote({ ...values, tags, id: record_id }).unwrap()
        : await createNote({ ...values, tags }).unwrap();

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
      note: attachment__id,
    })) as Array<INoteAttachments>;

    const promises: Array<GenericMutationResult<INoteAttachments, 'NotesAttachments', INoteAttachments>> = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createNoteAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: INoteAttachments[]) => {
    const promises: Array<GenericMutationResult<INoteAttachments, 'NotesAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteNoteAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const {
    touched,
    errors,
    handleSubmit,
    isSubmitting,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: note?.title ?? '',
      description: note?.description ?? '',
      associated_to: single_property ? [single_property] : ([] as Option[]),
      tags: tags_list ? tags_list : [],
      old_files: note_attachments ? note_attachments : ([] as INoteAttachments[]),
      files: [] as File[],
    },
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      let property_id = 0;
      if (values.associated_to && Array.isArray(values.associated_to) && values.associated_to.length > 0) {
        property_id = Number((values.associated_to[0] as IPropertyAPI).id);
      }

      const data: NotesFormValues = {
        ...values,
        associated_property: property_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/notes/details/${result.data.id}`, true, 'notes');
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
        });
    },
    validationSchema: formValidation,
  });

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

  const handleRemoveCurrentFiles = (file: INoteAttachments, current: INoteAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  return (
    <PageContainer>
      <div className="my-3">
        <BackButton />
        <h1 className="fw-bold h4 mt-1">{update ? 'Update' : 'Create'} Note</h1>
      </div>
      <Card className="border-0 p-0 page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <div>
            <p className="fw-bold m-0 text-primary">Note {update ? 'update' : 'creation'}</p>
            <p className="small m-0">Fill out the form to {update ? 'update' : 'create'} note</p>
          </div>
        </Card.Header>

        <Card.Body className="p-4 text-start">
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            <Row>
              <Col xxl={4} lg={5} md={6}>
                <Row>
                  <Form.Group as={Col} xs={12} className="mb-4" controlId="NotesFormTitle">
                    <Form.Label className="form-label-md">Note title</Form.Label>
                    <Form.Control
                      autoFocus
                      type="text"
                      name={title.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      isValid={touched.title && !errors.title}
                      isInvalid={touched.title && !!errors.title}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} xs={12} className="mb-4" controlId="NotesFormDescription">
                    <Form.Label className="form-label-md">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name={description.name}
                      isValid={touched.description && !errors.description}
                      isInvalid={touched.description && !!errors.description}
                      value={values.description}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Col xs={12}>
                    <FilterPaginateInput
                      labelText="Associated to"
                      name={associated_to.name}
                      model_label="property.Property"
                      controlId={`NotesFormAssociatedPropertyName`}
                      placeholder={`Select`}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-3',
                      }}
                      selected={values.associated_to}
                      onSelectChange={selected => {
                        if (selected.length) {
                          setFieldValue('associated_to', selected);
                        } else {
                          setFieldValue('associated_to', []);
                        }
                      }}
                      onBlurChange={() => setFieldTouched(associated_to.name, true)}
                      isValid={touched.associated_to && !errors.associated_to}
                      isInvalid={touched.associated_to && !!errors.associated_to}
                      labelKey={'name'}
                      disabled={singlePropLoading || singlePropFetching || (note && isPositiveNumber(note.id))}
                      error={errors.associated_to}
                    />
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs={12}>
                    <Form.Group controlId="NotesFormAttachments">
                      <Form.Label className="form-label-md">Attachments</Form.Label>
                      <div className="ratio ratio-21x9">
                        <Dropzone
                          name="files"
                          onDrop={onDrop}
                          disabled={noteAttachmentsFetching || noteAttachmentsLoading}
                          accept={FILE_TYPES_DOCS_IMAGES}
                          onError={error => setFieldError('files', error.message)}
                          maxSize={5242880}
                        />
                      </div>
                      <Form.Control.Feedback
                        type="invalid"
                        className={clsx({ 'd-block': touched.files && !!errors.files })}
                      >
                        {errors.files?.toString()}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col lg={5} md xs={{ order: 'last' }}>
                <TagsInput
                  label={'Tags'}
                  name={tag_input.name}
                  tags={values.tags}
                  onCreate={data => setFieldValue(tag_input.name, data)}
                  isValid={touched.tags && !errors.tags}
                  isInvalid={touched.tags && !!errors.tags}
                  controlID={'NotesFormTags'}
                  onBlur={() => setFieldTouched(tag_input.name, true)}
                  disabled={tagsLoading || tagsFetching}
                  error={errors.tags}
                />
              </Col>
              <Col lg={{ span: 6, order: 'last' }} md={{ span: 8, order: 'last' }} xs={{ order: '2' }}>
                <Row>
                  {values.files.map(file => {
                    const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
                    const progressed = currentProgress && currentProgress.progress ? currentProgress.progress : 0;

                    return (
                      <Col key={file.name} xxl={4} xl={6} lg={4} md={6}>
                        <FileAttachments
                          onRemove={() => {
                            const remainingFiles = values.files.filter(value => value.name !== file.name);
                            setFieldValue('files', remainingFiles);
                            setSelectedFiles(remainingFiles);
                          }}
                          progress={progressed}
                          file={file}
                        />
                      </Col>
                    );
                  })}
                  {values.old_files.map((file, indx) => (
                    <Col key={indx} xxl={4} xl={6} lg={4} md={6}>
                      <FileAttachments onRemove={() => handleRemoveCurrentFiles(file, values.old_files)} file={file} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            <Stack gap={3} direction="horizontal" className="justify-content-end mt-5 align-items-center">
              <Button type="reset" variant="light border-primary" className="px-4 py-1" onClick={() => redirect(-1)}>
                Cancel
              </Button>
              <SubmitBtn type="submit" loading={isSubmitting || isUploading} variant="primary" className="px-4 py-1">
                {update ? 'Update Note' : 'Create'}
              </SubmitBtn>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default NotesCRUD;
