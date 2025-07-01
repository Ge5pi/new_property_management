const formFields = {
  vendor: {
    name: 'vendor',
    requiredErrorMsg: 'Please select a vendor',
  },
  description: {
    name: 'description',
    requiredErrorMsg: 'Please enter description',
  },
  required_by_date: {
    name: 'required_by_date',
    requiredErrorMsg: 'Please enter date',
  },
  items: {
    name: 'items',
    inventory_item: {
      name: 'inventory_item',
      requiredErrorMsg: 'Please select an inventory item',
    },
    quantity: {
      name: 'quantity',
      requiredErrorMsg: 'Please enter item quantity',
    },
    line_total: {
      name: 'line_total',
      requiredErrorMsg: 'Invalid value found for line total',
    },
  },
  // tax_charge_type: {
  //   name: 'tax_charge_type',
  //   requiredErrorMsg: 'Please enter one of the field',
  // },
  // tax_flat: {
  //   name: 'tax_flat',
  //   requiredErrorMsg: 'Please enter tax value',
  // },
  // tax_percentage: {
  //   name: 'tax_percentage',
  //   requiredErrorMsg: 'Please enter tax value',
  // },
  tax: {
    name: 'tax',
    requiredErrorMsg: 'Please enter tax value',
  },
  shipping_charge_type: {
    name: 'shipping_charge_type',
    requiredErrorMsg: 'Please enter one of the field',
  },
  shipping_flat: {
    name: 'shipping_flat',
    requiredErrorMsg: 'Please enter shipping charges',
  },
  shipping_percentage: {
    name: 'shipping_percentage',
    requiredErrorMsg: 'Please enter shipping value',
  },
  // discount_charge_type: {
  //   name: 'discount_charge_type',
  //   requiredErrorMsg: 'Please enter one of the field',
  // },
  // discount_flat: {
  //   name: 'discount_flat',
  //   requiredErrorMsg: 'Please enter discount value (if any)',
  // },
  // discount_percentage: {
  //   name: 'discount_percentage',
  //   requiredErrorMsg: 'Please enter discount value (if any)',
  // },
  discount: {
    name: 'discount',
    requiredErrorMsg: 'Please enter discount value (if any)',
  },
  notes: {
    name: 'notes',
    requiredErrorMsg: 'Please enter a note (for yourself)',
  },
};

export default formFields;
