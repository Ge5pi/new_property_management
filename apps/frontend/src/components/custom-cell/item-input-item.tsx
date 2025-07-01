import { useMemo } from 'react';
import { FormControl, FormGroup, Stack } from 'react-bootstrap';
import { Hint } from 'react-bootstrap-typeahead';
import { TypeaheadInputProps } from 'react-bootstrap-typeahead/types/types';

import { Avatar } from 'core-ui/user-avatar';

import { getStringPersonName } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { IOwner, IVendor } from 'interfaces/IPeoples';
import { ITenantAPI } from 'interfaces/ITenant';

interface IProps extends TypeaheadInputProps {
  option?: IUser | IOwner | ITenantAPI | IVendor;
}

const ItemInputItem = ({ option, inputRef, value, referenceElementRef, ...inputProps }: IProps) => {
  const icon = useMemo(() => {
    if (option) {
      return getStringPersonName(option);
    }
  }, [option]);

  return (
    <FormGroup>
      <Stack direction="horizontal">
        {icon && (
          <div
            style={{ zIndex: 5, left: `.5rem` }}
            className="text-primary position-absolute bg-transparent border-0 top-50 translate-middle-y"
          >
            <Avatar name={icon} size={25} />
          </div>
        )}
        <FormGroup className="position-relative w-100">
          <Hint>
            <FormControl
              {...inputProps}
              value={value as string}
              ref={(node: HTMLInputElement) => {
                inputRef(node);
                referenceElementRef(node);
              }}
            />
          </Hint>
        </FormGroup>
      </Stack>
    </FormGroup>
  );
};

export default ItemInputItem;
