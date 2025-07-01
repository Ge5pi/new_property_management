const formFields = {
  title: {
    name: 'title',
    requiredErrorMsg: 'Please enter title',
  },
  selection: {
    name: 'selection',
    requiredErrorMsg: 'Selection type not provided',
  },
  is_all_properties: {
    name: 'is_all_properties',
    requiredErrorMsg: 'Please select is all',
  },
  is_all_units: {
    name: 'is_all_units',
    requiredErrorMsg: 'Please select is all units',
  },
  is_selective_properties: {
    name: 'is_selective_properties',
    requiredErrorMsg: 'Please select is all',
  },
  is_selective_units: {
    name: 'is_selective_units',
    requiredErrorMsg: 'Please select is all units',
  },
  body: {
    name: 'body',
    requiredErrorMsg: 'Please enter body',
  },
  is_send_email: {
    name: 'send_by_email',
    requiredErrorMsg: 'Please select is send email',
  },
  display_on_portal: {
    name: 'display_on_tenant_portal',
    requiredErrorMsg: 'Please select display on portal',
  },
  display_date: {
    name: 'display_date',
    requiredErrorMsg: 'Please select display date',
  },
  expiry_date: {
    name: 'expiry_date',
    requiredErrorMsg: 'Please select expiry date',
  },
  properties: {
    name: 'properties',
    requiredErrorMsg: 'Please select at least 1 property',
  },
  units: {
    name: 'units',
    requiredErrorMsg: 'Please select at least 1 unit',
  },
};

export default formFields;
