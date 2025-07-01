const formFields = {
  recipient_type: {
    name: 'recipient_type',
    requiredErrorMsg: 'Please select recipient type',
  },
  individual_recipient_type: {
    name: 'individual_recipient_type',
    requiredErrorMsg: 'Please select individual recipient type',
  },
  tenants: {
    name: 'tenants',
    requiredErrorMsg: 'Please select tenants',
  },
  owners: {
    name: 'owners',
    requiredErrorMsg: 'Please select owners',
  },
  vendors: {
    name: 'vendors',
    requiredErrorMsg: 'Please select vendors',
  },
  units: {
    name: 'units',
    requiredErrorMsg: 'Please select units',
  },
  template: {
    name: 'template',
    requiredErrorMsg: 'Please select a template',
  },
  subject: {
    name: 'subject',
    requiredErrorMsg: 'Please enter subject',
  },
  body: {
    name: 'body',
    requiredErrorMsg: 'Please enter body',
  },
  signature: {
    name: 'signature',
    requiredErrorMsg: 'Please enter signature',
  },
  existing_signature: {
    name: 'existing_signature',
  },
  files: {
    name: 'attachments',
    requiredErrorMsg: 'Please select an attachment',
  },
};

export default formFields;
