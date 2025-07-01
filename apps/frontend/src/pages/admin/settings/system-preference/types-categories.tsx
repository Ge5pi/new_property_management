import { useState } from 'react';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateContactCategoryMutation,
  useCreateInventoryTypeMutation,
  useCreatePropertyTypeMutation,
  useDeleteContactCategoryMutation,
  useDeleteInventoryTypeMutation,
  useDeletePropertyTypeMutation,
  useGetContactCategoriesQuery,
  useGetInventoryTypesQuery,
  useGetPropertyTypesQuery,
  useUpdateContactCategoryMutation,
  useUpdateInventoryTypeMutation,
  useUpdatePropertyTypeMutation,
} from 'services/api/system-preferences';

import { Confirmation, PleaseWait } from 'components/alerts';

import { NewContactCategoryModal } from 'core-ui/popups/contact-category';
import { NewInventoryItemTypeModal } from 'core-ui/popups/inventory-item-type';
import { NewPropertyTypeModal } from 'core-ui/popups/types-categories';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { ContactCategory, InventoryType, PropertyType } from 'interfaces/ISettings';

import SystemPreferencesTable from './components/system-preferences-table';

const TypesCategories = () => {
  return (
    <div>
      <div className="mb-3">
        <PropertyTypes />
      </div>

      <div className="mb-3">
        <ContactCategories />
      </div>

      <div className="mb-3">
        <InventoryItemTypes />
      </div>
    </div>
  );
};

const PropertyTypes = () => {
  const [
    createPropertyType,
    { isSuccess: isCreatePropertyTypeSuccess, isError: isCreatePropertyTypeError, error: createPropertyTypeError },
  ] = useCreatePropertyTypeMutation();

  useResponse({
    isSuccess: isCreatePropertyTypeSuccess,
    successTitle: 'New Property Type has been added',
    isError: isCreatePropertyTypeError,
    error: createPropertyTypeError,
  });

  const [
    updatePropertyType,
    { isSuccess: isUpdatePropertyTypeSuccess, isError: isUpdatePropertyTypeError, error: updatePropertyTypeError },
  ] = useUpdatePropertyTypeMutation();

  useResponse({
    isSuccess: isUpdatePropertyTypeSuccess,
    successTitle: 'Property Type has been updated',
    isError: isUpdatePropertyTypeError,
    error: updatePropertyTypeError,
  });

  const [
    deletePropertyTypeByID,
    { isSuccess: isDeletePropertyTypeSuccess, isError: isDeletePropertyTypeError, error: deletePropertyTypeError },
  ] = useDeletePropertyTypeMutation();

  useResponse({
    isSuccess: isDeletePropertyTypeSuccess,
    successTitle: 'You have deleted an Property Type',
    isError: isDeletePropertyTypeError,
    error: deletePropertyTypeError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description:
        'This may result in deletion of all associated records including properties, leases, etc.\n\nAre you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deletePropertyTypeByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Property Types"
      useData={useGetPropertyTypesQuery}
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: (
            <NewPropertyTypeModal
              update
              updatePropertyType={updatePropertyType}
              property_type={row.original as PropertyType}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as PropertyType;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewPropertyTypeModal createPropertyType={createPropertyType} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

const InventoryItemTypes = () => {
  const [
    createInventoryType,
    { isSuccess: isCreateInventoryTypeSuccess, isError: isCreateInventoryTypeError, error: createInventoryTypeError },
  ] = useCreateInventoryTypeMutation();

  useResponse({
    isSuccess: isCreateInventoryTypeSuccess,
    successTitle: 'New Inventory Type has been added',
    isError: isCreateInventoryTypeError,
    error: createInventoryTypeError,
  });

  const [
    updateInventoryType,
    { isSuccess: isUpdateInventoryTypeSuccess, isError: isUpdateInventoryTypeError, error: updateInventoryTypeError },
  ] = useUpdateInventoryTypeMutation();

  useResponse({
    isSuccess: isUpdateInventoryTypeSuccess,
    successTitle: 'Inventory Type has been updated',
    isError: isUpdateInventoryTypeError,
    error: updateInventoryTypeError,
  });

  const [
    deleteInventoryTypeByID,
    { isSuccess: isDeleteInventoryTypeSuccess, isError: isDeleteInventoryTypeError, error: deleteInventoryTypeError },
  ] = useDeleteInventoryTypeMutation();

  useResponse({
    isSuccess: isDeleteInventoryTypeSuccess,
    successTitle: 'You have deleted an Inventory Type',
    isError: isDeleteInventoryTypeError,
    error: deleteInventoryTypeError,
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
        deleteInventoryTypeByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Inventory Types"
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      useData={useGetInventoryTypesQuery}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: (
            <NewInventoryItemTypeModal
              update
              updateInventoryType={updateInventoryType}
              inventory_type={row.original as InventoryType}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as InventoryType;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewInventoryItemTypeModal createInventoryType={createInventoryType} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

const ContactCategories = () => {
  const [
    createContactCategory,
    {
      isSuccess: isCreateContactCategorySuccess,
      isError: isCreateContactCategoryError,
      error: createContactCategoryError,
    },
  ] = useCreateContactCategoryMutation();

  useResponse({
    isSuccess: isCreateContactCategorySuccess,
    successTitle: 'New Contact Category has been added',
    isError: isCreateContactCategoryError,
    error: createContactCategoryError,
  });

  const [
    updateContactCategory,
    {
      isSuccess: isUpdateContactCategorySuccess,
      isError: isUpdateContactCategoryError,
      error: updateContactCategoryError,
    },
  ] = useUpdateContactCategoryMutation();

  useResponse({
    isSuccess: isUpdateContactCategorySuccess,
    successTitle: 'Contact Category has been updated',
    isError: isUpdateContactCategoryError,
    error: updateContactCategoryError,
  });

  const [
    deleteContactCategoryByID,
    {
      isSuccess: isDeleteContactCategorySuccess,
      isError: isDeleteContactCategoryError,
      error: deleteContactCategoryError,
    },
  ] = useDeleteContactCategoryMutation();

  useResponse({
    isSuccess: isDeleteContactCategorySuccess,
    successTitle: 'You have deleted an Contact Category',
    isError: isDeleteContactCategoryError,
    error: deleteContactCategoryError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description:
        'This may result in deletion of all associated records including contacts, etc.\n\nAre you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteContactCategoryByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <SystemPreferencesTable
      title="Contacts Category"
      editPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      newRecordPermission={PERMISSIONS.SYSTEM_PREFERENCES}
      deletePermission={PERMISSIONS.SYSTEM_PREFERENCES}
      useData={useGetContactCategoriesQuery}
      onEdit={row => {
        SweetAlert({
          size: 'md',
          html: (
            <NewContactCategoryModal
              update
              updateContactCategory={updateContactCategory}
              inventory_type={row.original as ContactCategory}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      onDelete={row => {
        const row1 = row.original as ContactCategory;
        if (row1.id) {
          deleteRecord(row1.id);
        }
      }}
      isDeleteDisabled={disabled}
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: <NewContactCategoryModal createContactCategory={createContactCategory} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

export default TypesCategories;
