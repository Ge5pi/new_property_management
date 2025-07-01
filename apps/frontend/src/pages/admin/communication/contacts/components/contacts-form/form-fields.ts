const formFields = {
  contact_name: {
    name: 'name',
    requiredErrorMsg: 'Please enter title',
  },
  category: {
    name: 'category',
    requiredErrorMsg: 'Please select category',
  },
  primary_contact: {
    name: 'primary_contact',
    requiredErrorMsg: 'Please select primary contact',
  },
  secondary_contact: {
    name: 'secondary_contact',
    requiredErrorMsg: 'Please select secondary contact',
  },
  email: {
    name: 'email',
    requiredErrorMsg: 'Please enter email',
  },
  website: {
    name: 'website',
    requiredErrorMsg: 'Please enter website',
  },
  address: {
    name: 'street_address',
    requiredErrorMsg: 'Please enter address',
  },
  is_display_to_tenant: {
    name: 'display_to_tenants',
  },
  is_selective: {
    name: 'selective',
  },
};

export default formFields;
