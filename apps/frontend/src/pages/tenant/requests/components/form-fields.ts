export default {
  request_type: {
    name: 'request_type',
    label: 'Request Type',
    MAINTENANCE: {
      category: {
        name: 'category',
        requiredErrorMsg: 'Please select category',
        label: 'Category',
      },
      is_permission: {
        name: 'is_permission',
        label: 'Permission',
      },
      is_pets: {
        name: 'is_pets',
        label: 'Pets',
      },
    },
  },
  subject: {
    name: 'subject',
    label: 'Subject',
    requiredErrorMsg: 'Please enter subject',
  },
  description: {
    name: 'description',
    label: 'Description',
    requiredErrorMsg: 'Please enter description',
  },
  files: {
    name: 'files',
    label: 'Attachments',
    requiredErrorMsg: 'Please upload files',
  },
};
