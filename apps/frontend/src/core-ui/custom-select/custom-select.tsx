import { FocusEventHandler, isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Form, InputGroup, Stack } from 'react-bootstrap';
import { Hint, Typeahead, TypeaheadRef } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';

import { SearchIcon } from 'core-ui/icons';

import { ISelectOption } from 'interfaces/IInputs';

import { SimpleSelectProps } from './types/select';

import './select.styles.css';

const CustomSelect = ({
  classNames,
  onBlurChange,
  error,
  onSelectChange,
  searchIcon = false,
  searchable = false,
  labelText = '',
  controlId = '',
  value = '',
  defaultValue = '',
  options = [],
  inputProps: formInput,
  ...props
}: SimpleSelectProps) => {
  const [selected, setSelection] = useState<ISelectOption[]>(() =>
    handleInitialValue(options, value.toString(), defaultValue.toString())
  );
  const [hasIcon, selectionHasIcon] = useState(false);
  const handleSelection = (selected: Option[]) => {
    if (selected.length > 0) {
      if (onSelectChange && options.length > 0) {
        onSelectChange((selected[0] as ISelectOption).value.toString());
      }

      if ((selected[0] as ISelectOption).icon) {
        selectionHasIcon(true);
      } else {
        selectionHasIcon(false);
      }
    }

    setSelection(selected as ISelectOption[]);
  };

  const handleBlurState: FocusEventHandler<HTMLInputElement> = ev => {
    if (!selected || selected.length <= 0) {
      setSelection(() => handleInitialValue(options, value.toString(), defaultValue.toString()));
    }

    if (onBlurChange) onBlurChange(ev);
  };

  const ref = useRef<TypeaheadRef | null>(null);
  useLayoutEffect(() => {
    const current = ref.current;
    if (current && current.inputNode) {
      const inputHint = current.inputNode.nextElementSibling;
      if (inputHint) inputHint.setAttribute('name', `Typeahead_${controlId}_HintInput`);
    }
  }, [controlId]);

  useEffect(() => {
    setSelection(() => handleInitialValue(options, value.toString(), defaultValue.toString()));
  }, [options, value, defaultValue]);

  return (
    <Form.Group className={classNames?.wrapperClass} controlId={controlId}>
      {labelText && <Form.Label className={clsx(`text-primary`, classNames?.labelClass)}>{labelText}</Form.Label>}
      <InputGroup className={clsx('position-relative input-icon-end', { 'input-with-icon': searchIcon })}>
        <Form.Group className="position-relative w-100">
          <Typeahead
            {...props}
            flip
            ref={ref}
            positionFixed
            highlightOnlyResult={!props.allowNew}
            className={clsx(
              props.className,
              'm-0 select-selected-wrapper overflow-hidden',
              classNames?.backgroundClass ?? 'bg-white',
              searchIcon ? 'bg-none' : '',
              'p-0 border-0'
            )}
            inputProps={{
              ...formInput,
              className: clsx(
                formInput?.className,
                classNames?.selectClass,
                classNames?.backgroundClass ?? 'bg-white',
                'select-selected rbtk-select',
                {
                  'is-invalid': props.isInvalid,
                  'is-valid': props.isValid,
                  'bg-img-none': searchIcon,
                }
              ),
              style: {
                ...formInput?.style,
                cursor: !searchable ? 'default' : 'auto',
                paddingLeft: hasIcon ? `2.5rem` : formInput?.style?.paddingLeft,
                zIndex: 2,
              },
              name: props.name,
              readOnly: !searchable || props.disabled,
              id: controlId,
            }}
            id={`Typeahead_${controlId}`}
            onChange={handleSelection}
            onBlur={handleBlurState}
            labelKey={'label'}
            options={options}
            selected={selected}
            filterBy={(option, props) => {
              const item = option as ISelectOption;
              if (props.selected.length) {
                return true;
              }
              return item.label.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;
            }}
            placeholder={props.placeholder ?? 'Select an option'}
            renderMenuItemChildren={option => {
              const item = option as ISelectOption;
              const isActive = selected.length > 0 && 'value' in selected[0] && item.value === selected[0].value;

              return (
                <Stack
                  direction="horizontal"
                  gap={1}
                  as={'span'}
                  className={clsx(isActive ? 'active' : '', 'text-wrap', classNames?.menuItemClassName)}
                >
                  {item.icon && <span className="fw-bold col-auto">{item.icon}</span>}
                  <span className="col">{item.label}</span>
                </Stack>
              );
            }}
            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
              <Form.Group>
                <Stack direction="horizontal">
                  {hasIcon && (
                    <div
                      style={{ zIndex: 5, left: `.5rem` }}
                      className="text-primary position-absolute bg-transparent border-0 top-50 translate-middle-y"
                    >
                      {selected[0].icon}
                    </div>
                  )}
                  <Form.Group className="position-relative w-100">
                    <Hint>
                      <Form.Control
                        {...inputProps}
                        value={inputProps.value as string}
                        ref={(node: HTMLInputElement) => {
                          inputRef(node);
                          referenceElementRef(node);
                        }}
                      />
                    </Hint>
                  </Form.Group>
                </Stack>
              </Form.Group>
            )}
          />
        </Form.Group>
        {searchIcon && (
          <InputGroup.Text
            style={{ zIndex: 3 }}
            className="text-primary position-absolute end-0 bg-transparent border-0 top-50 translate-middle-y"
          >
            <SearchIcon />
          </InputGroup.Text>
        )}
      </InputGroup>
      {error &&
        (isValidElement(error) ? (
          error
        ) : (
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': props.isInvalid && error })}>
            {Array.isArray(error) ? error.join(' \u2022 ') : error.toString()}
          </Form.Control.Feedback>
        ))}
    </Form.Group>
  );
};

export default CustomSelect;

const handleInitialValue = (options: ISelectOption[], initValue = '', defaultValue = '') => {
  if (!initValue && defaultValue) initValue = defaultValue.toString();
  const selection = options.find(opt => opt.value.toString() === initValue);
  if (selection) return [selection];
  return [];
};
