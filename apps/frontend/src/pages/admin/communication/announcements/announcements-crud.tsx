import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { clsx } from 'clsx';
import { Formik } from 'formik';

import {
  useCreateAnnouncementAttachmentsMutation,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementAttachmentsMutation,
  useGetAnnouncementAttachmentsQuery,
  useUpdateAnnouncementMutation,
} from 'services/api/announcement';
import { useGetListOfPropertiesQuery } from 'services/api/properties';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetListOfUnitsQuery } from 'services/api/units';

import { BackButton } from 'components/back-button';
import { CustomStepper } from 'components/custom-stepper';
import ActionButtons from 'components/custom-stepper/action-buttons';
import PageContainer from 'components/page-container';

import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';
import { useWindowSize } from 'hooks/useWindowSize';

import { announcementSteps } from 'constants/steps';
import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import {
  AnnouncementSelection,
  IAnnouncementAPI,
  IAnnouncementAttachments,
  ISingleAnnouncement,
} from 'interfaces/ICommunication';
import { IPropertyAPI } from 'interfaces/IProperties';

import { Step01Details, Step02Review } from './components/announcements-steps';
import formValidation from './components/announcements-steps/form-validation';

import './announcements.styles.css';

interface IProps {
  announcement?: ISingleAnnouncement;
  update?: boolean;
}

const AnnouncementsCRUD = ({ announcement, update }: IProps) => {
  const {
    data: announcement_attachments,
    isLoading: announcementAttachmentsLoading,
    isFetching: announcementAttachmentsFetching,
  } = useGetAnnouncementAttachmentsQuery(getIDFromObject('id', announcement));

  const [index, setIndex] = useState(1);
  const currentValidationSchema = formValidation[index - 1];

  const [width] = useWindowSize();
  const { redirect } = useRedirect();

  const [deletedFiles, setDeletedFiles] = useState<IAnnouncementAttachments[]>([]);
  const { isUploading, handleUpload, selectedFiles, ...uploadingStats } = useUploader('announcements');

  const isLastStep = index === announcementSteps.length;

  const prevButton = () => {
    setIndex(prevIndex => prevIndex - 1);
  };

  const selectionsUnit = ['APSU', 'SPSU'];
  const selectionsProperty = ['SPAU', 'SPSU'];
  const fetchUnitsIf = announcement && announcement.selection && selectionsUnit.includes(announcement.selection);
  const fetchPropertiesIf =
    announcement && announcement.selection && selectionsProperty.includes(announcement.selection);

  const {
    data: units_data,
    isLoading: unitsLoading,
    isFetching: unitsFetching,
  } = useGetListOfUnitsQuery(
    announcement && announcement.units && announcement.units.length > 0 && fetchUnitsIf
      ? (announcement.units as number[])
      : skipToken
  );

  const {
    data: properties_data,
    isLoading: propertiesLoading,
    isFetching: propertiesFetching,
  } = useGetListOfPropertiesQuery(
    announcement && announcement.properties && announcement.properties.length > 0 && fetchPropertiesIf
      ? (announcement.properties as number[])
      : skipToken
  );

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const [createAnnouncementAttachment] = useCreateAnnouncementAttachmentsMutation();
  const [deleteAnnouncementAttachment] = useDeleteAnnouncementAttachmentsMutation();

  const handleFormSubmission = async (values: IAnnouncementAPI) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = announcement && announcement.id ? Number(announcement.id) : -1;
    const response =
      update && record_id > 0
        ? await updateAnnouncement({ ...values, id: record_id }).unwrap()
        : await createAnnouncement(values).unwrap();

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
      announcement: attachment__id,
    })) as Array<IAnnouncementAttachments>;

    const promises: Array<
      GenericMutationResult<IAnnouncementAttachments, 'AnnouncementsAttachments', IAnnouncementAttachments>
    > = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createAnnouncementAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IAnnouncementAttachments[]) => {
    const promises: Array<GenericMutationResult<IAnnouncementAttachments, 'AnnouncementsAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteAnnouncementAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  return (
    <PageContainer>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">{update ? 'Update' : 'Create'} announcement</h1>
      </div>
      <Card className="border-0 p-0 page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <div>
            <p className="fw-bold m-0 text-primary">Announcement {update ? 'update' : 'creation'} form</p>
            <p className="small">Fill out the details of the announcement</p>
          </div>
        </Card.Header>

        <Card.Body className="px-0 text-start announcements-steps-card">
          <Formik
            initialValues={{
              units: units_data ? units_data : ([] as Option[]),
              properties: properties_data ? properties_data : ([] as Option[]),
              is_selective_units: announcement
                ? Boolean(announcement.selection === 'APSU' || announcement.selection === 'SPSU')
                : false,
              is_selective_properties: announcement
                ? Boolean(announcement.selection === 'SPAU' || announcement.selection === 'SPSU')
                : false,
              is_all_units: announcement
                ? Boolean(announcement.selection === 'APAU' || announcement.selection === 'SPAU')
                : true,
              is_all_properties: announcement
                ? Boolean(announcement.selection === 'APAU' || announcement.selection === 'APSU')
                : true,
              selection: announcement?.selection ?? ('APAU' as AnnouncementSelection),
              title: announcement?.title ?? '',
              body: announcement?.body ?? '',
              send_by_email: announcement?.send_by_email ?? false,
              display_on_tenant_portal: announcement?.display_on_tenant_portal ?? false,
              display_date: announcement?.display_date ?? '',
              expiry_date: announcement?.expiry_date ?? '',
              old_files: announcement_attachments ? announcement_attachments : ([] as IAnnouncementAttachments[]),
              files: [] as File[],
            }}
            enableReinitialize
            onSubmit={(values, { setTouched, setFieldError, setSubmitting }) => {
              setSubmitting(true);
              if (isLastStep) {
                const is_selective_units = values.is_selective_units;
                const is_selective_properties = values.is_selective_properties;
                const is_all_units = values.is_all_units;
                const is_all_properties = values.is_all_properties;

                const properties: Array<number> = [];
                if (is_selective_properties) {
                  (values.properties as IPropertyAPI[]).forEach(selected => {
                    properties.push(Number(selected.id));
                  });
                }
                const units: Array<number> = [];
                if (is_selective_units) {
                  (values.units as IPropertyAPI[]).forEach(selected => {
                    units.push(Number(selected.id));
                  });
                }

                let selection: AnnouncementSelection = 'APAU';
                if (is_selective_properties && is_all_units) {
                  selection = 'SPAU';
                } else if (is_selective_properties && is_selective_units) {
                  selection = 'SPSU';
                } else if (is_all_properties && is_selective_units) {
                  selection = 'APSU';
                }

                const data: IAnnouncementAPI = {
                  ...values,
                  selection,
                  properties,
                  units,
                };

                handleFormSubmission(data)
                  .then(result => {
                    Notify.show({ type: result.status, title: result.feedback });
                    redirect(`/announcements/details/${result.data.id}`, true, 'announcements');
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
              } else {
                setIndex(prev => prev + 1);
                setSubmitting(false);
                setTouched({});
              }
            }}
            validationSchema={currentValidationSchema}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form className="text-start" noValidate onSubmit={handleSubmit}>
                <CustomStepper
                  nameAsLabel
                  flipStepNumber
                  active={index}
                  steps={announcementSteps}
                  className={clsx({ 'w-25': width >= 1400 }, { 'w-50': width >= 991.98 && width < 1400 })}
                  actions={
                    <ActionButtons
                      className="px-4"
                      currentItem={index}
                      disabled={isSubmitting || isUploading}
                      totalItems={announcementSteps.length}
                      prevButton={prevButton}
                    />
                  }
                >
                  <Step01Details
                    {...uploadingStats}
                    loadingAttachments={announcementAttachmentsFetching || announcementAttachmentsLoading}
                    loadingProperties={propertiesLoading || propertiesFetching}
                    loadingUnits={unitsLoading || unitsFetching}
                    setDeletedFiles={setDeletedFiles}
                  />
                  <Step02Review {...uploadingStats} />
                </CustomStepper>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default AnnouncementsCRUD;
