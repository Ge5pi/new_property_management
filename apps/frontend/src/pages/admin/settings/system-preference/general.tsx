import { useState } from 'react';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateGeneralLabelMutation,
  useCreateGeneralTagMutation,
  useCreateInventoryLocationMutation,
  useDeleteGeneralLabelMutation,
  useDeleteGeneralTagMutation,
  useDeleteInventoryLocationMutation,
  useGetGeneralLabelsQuery,
  useGetGeneralTagsQuery,
  useGetInventoryLocationsQuery,
  useUpdateGeneralLabelMutation,
  useUpdateGeneralTagMutation,
  useUpdateInventoryLocationMutation,
} from 'services/api/system-preferences';

import { Confirmation, PleaseWait } from 'components/alerts';

import { NewInventoryLocationsModal } from 'core-ui/popups/new-inventory-locations';
import { NewLabelModal } from 'core-ui/popups/new-label';
import { NewTagModal } from 'core-ui/popups/new-tags';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { GeneralLabels, GeneralTags, InventoryLocations } from 'interfaces/ISettings';

import SystemPreferencesTable from './components/system-preferences-table';

const General = () => {
  return (
    <div>
      <div className="mb-3">
        <Tags />
      </div>

      <div className="mb-3">
        <Labels />
      </div>

      <div className="mb-3">
        <InventoryLocation />
      </div>
    </div>
  );
};

const Tags = () => {
  const [
    createGeneralTag,
    { isSuccess: isCreateGeneralTagSuccess, isError: isCreateGeneralTagError, error: createGeneralTagError },
  ] = useCreateGeneralTagMutation();

  useResponse({
    isSuccess: isCreateGeneralTagSuccess,
    successTitle: 'New Tag has been added',
    isError: isCreateGeneralTagError,
    error: createGeneralTagError,
  });

  const [
    updateGeneralTag,
    { isSuccess: isUpdateGeneralTagSuccess, isError: isUpdateGeneralTagError, error: updateGeneralTagError },
  ] = useUpdateGeneralTagMutation();

  useResponse({
    isSuccess: isUpdateGeneralTagSuccess,
    successTitle: 'Tag has been updated',
    isError: isUpdateGeneralTagError,
    error: updateGeneralTagError,
  });

  const [
    deleteGeneralTagByID,
    { isSuccess: isDeleteGeneralTagSuccess, isError: isDeleteGeneralTagError, error: deleteGeneralTagError },
  ] = useDeleteGeneralTagMutation();

  useResponse({
    isSuccess: isDeleteGeneralTagSuccess,
    successTitle: 'You have deleted Tag',
    isError: isDeleteGeneralTagError,
    error: deleteGeneralTagError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description:
        'This may result in deletion of all associated records including units, notes, etc.\n\nAre you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteGeneralTagByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Tags"
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      useData={useGetGeneralTagsQuery}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: <NewTagModal update updateGeneralTag={updateGeneralTag} general_tag={row.original as GeneralTags} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as GeneralTags;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewTagModal createGeneralTag={createGeneralTag} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

const Labels = () => {
  const [
    createGeneralLabel,
    { isSuccess: isCreateGeneralLabelSuccess, isError: isCreateGeneralLabelError, error: createGeneralLabelError },
  ] = useCreateGeneralLabelMutation();

  useResponse({
    isSuccess: isCreateGeneralLabelSuccess,
    successTitle: 'New Label has been added',
    isError: isCreateGeneralLabelError,
    error: createGeneralLabelError,
  });

  const [
    updateGeneralLabel,
    { isSuccess: isUpdateGeneralLabelSuccess, isError: isUpdateGeneralLabelError, error: updateGeneralLabelError },
  ] = useUpdateGeneralLabelMutation();

  useResponse({
    isSuccess: isUpdateGeneralLabelSuccess,
    successTitle: 'Label has been updated',
    isError: isUpdateGeneralLabelError,
    error: updateGeneralLabelError,
  });

  const [
    deleteGeneralLabelByID,
    { isSuccess: isDeleteGeneralLabelSuccess, isError: isDeleteGeneralLabelError, error: deleteGeneralLabelError },
  ] = useDeleteGeneralLabelMutation();

  useResponse({
    isSuccess: isDeleteGeneralLabelSuccess,
    successTitle: 'You have deleted an Label',
    isError: isDeleteGeneralLabelError,
    error: deleteGeneralLabelError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description:
        'This may result in deletion of all associated records including inventory items, upcoming activities, etc.\n\nAre you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteGeneralLabelByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Labels"
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      useData={useGetGeneralLabelsQuery}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: (
            <NewLabelModal
              update
              updateGeneralLabel={updateGeneralLabel}
              general_label={row.original as GeneralLabels}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as GeneralLabels;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewLabelModal createGeneralLabel={createGeneralLabel} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

const InventoryLocation = () => {
  const [
    createInventoryLocation,
    {
      isSuccess: isCreateInventoryLocationSuccess,
      isError: isCreateInventoryLocationError,
      error: createInventoryLocationError,
    },
  ] = useCreateInventoryLocationMutation();

  useResponse({
    isSuccess: isCreateInventoryLocationSuccess,
    successTitle: 'New Inventory Location has been added',
    isError: isCreateInventoryLocationError,
    error: createInventoryLocationError,
  });

  const [
    updateInventoryLocation,
    {
      isSuccess: isUpdateInventoryLocationSuccess,
      isError: isUpdateInventoryLocationError,
      error: updateInventoryLocationError,
    },
  ] = useUpdateInventoryLocationMutation();

  useResponse({
    isSuccess: isUpdateInventoryLocationSuccess,
    successTitle: 'Inventory Location has been updated',
    isError: isUpdateInventoryLocationError,
    error: updateInventoryLocationError,
  });

  const [
    deleteInventoryLocationByID,
    {
      isSuccess: isDeleteInventoryLocationSuccess,
      isError: isDeleteInventoryLocationError,
      error: deleteInventoryLocationError,
    },
  ] = useDeleteInventoryLocationMutation();

  useResponse({
    isSuccess: isDeleteInventoryLocationSuccess,
    successTitle: 'You have deleted an Inventory Location',
    isError: isDeleteInventoryLocationError,
    error: deleteInventoryLocationError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description:
        'This may result in deletion of all associated records including inventory items, etc.\n\nAre you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteInventoryLocationByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Inventory Locations"
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      useData={useGetInventoryLocationsQuery}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: (
            <NewInventoryLocationsModal
              update
              updateInventoryLocation={updateInventoryLocation}
              inventory_location={row.original as InventoryLocations}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as InventoryLocations;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewInventoryLocationsModal createInventoryLocation={createInventoryLocation} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

export default General;
