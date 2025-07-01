import { isValidElement, useLayoutEffect, useRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { AsyncTypeahead, TypeaheadRef } from 'react-bootstrap-typeahead';

import { clsx } from 'clsx';

import { SearchIcon } from 'core-ui/icons';

import { FilterListProps } from './types/select';

import './select.styles.css';

const FilterInput = ({
  classNames,
  onBlurChange,
  error,
  onSelectChange,
  labelText = '',
  searchIcon = true,
  overflow = false,
  controlId = '',
  inputProps,
  isFetching,
  ...props
}: FilterListProps) => {
  const ref = useRef<TypeaheadRef | null>(null);
  useLayoutEffect(() => {
    const current = ref.current;
    if (current && current.inputNode) {
      const inputHint = current.inputNode.nextElementSibling;
      if (inputHint) inputHint.setAttribute('name', `AsyncTypeahead_${controlId}_HintInput`);
    }
  }, [controlId]);

  return (
    <Form.Group className={clsx(classNames?.wrapperClass)} controlId={controlId}>
      {labelText && <Form.Label className={clsx(`text-primary`, classNames?.labelClass)}>{labelText}</Form.Label>}
      <InputGroup className={clsx('position-relative input-icon-end', { 'input-with-icon': searchIcon })}>
        <AsyncTypeahead
          {...props}
          flip
          ref={ref}
          minLength={0}
          highlightOnlyResult={!props.allowNew}
          isLoading={false}
          positionFixed
          inputProps={{
            ...inputProps,
            name: props.name,
            id: controlId,
            className: clsx('rbtk-select select-selected', inputProps?.className, classNames?.selectClass, {
              'is-invalid': props.isInvalid,
              'is-valid': props.isValid,
              'filter-input-loading': isFetching,
              'bg-img-none': searchIcon && !isFetching,
            }),
            style: {
              ...inputProps?.style,
              zIndex: searchIcon ? 'auto' : 2,
              cursor: !searchIcon ? 'default' : 'auto',
            },
            readOnly: props.disabled,
          }}
          className={clsx(
            'm-0 select-selected-wrapper',
            { 'overflow-hidden': !overflow },
            { 'overflow-auto': overflow },
            classNames?.backgroundClass ?? 'bg-white',
            searchIcon && !isFetching ? 'bg-none' : '',
            props.className,
            'p-0 border-0'
          )}
          id={`AsyncTypeahead_${controlId}`}
          onChange={onSelectChange}
          onBlur={onBlurChange}
        />
        {searchIcon && !isFetching && (
          <InputGroup.Text
            style={{ zIndex: 3 }}
            className="text-primary position-absolute end-0 bg-transparent border-0 top-50 translate-middle-y"
          >
            <SearchIcon size={props.size ? '18px' : '24px'} />
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

export default FilterInput;
