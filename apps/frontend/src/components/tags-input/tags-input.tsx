import { ReactNode, isValidElement, useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Token, UseAsyncProps } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { FormikErrors } from 'formik';

import { FilterPaginateInput } from 'core-ui/custom-select';

import { GeneralTags } from 'interfaces/ISettings';

import './tags-input.styles.css';

interface FilterProps extends Partial<UseAsyncProps> {
  name: string;
  label?: string | JSX.Element;
  controlID: string;
  onCreate: (tag: Array<GeneralTags>, removed?: boolean) => void;
  tags: Array<GeneralTags>;
  error?: ReactNode | FormikErrors<unknown>[];
}

const TagsInput = ({ label, controlID, tags, onCreate, error, ...props }: FilterProps) => {
  const handleParentClick = () => {
    const inputElem = document.querySelector('#' + controlID) as HTMLInputElement;
    if (inputElem) inputElem.focus();
  };

  const [selectedList, setSelectedList] = useState<Array<GeneralTags>>(tags);
  const onTagSelected = useCallback(
    (selected: Option[]) => {
      let selection = selected as GeneralTags[];
      setSelectedList(() => {
        if (selection.length > 0) {
          selection = selection.filter(
            (value, index, self) =>
              index === self.findIndex(t => t.name.toLowerCase().trim() === value.name.toLowerCase().trim())
          );
        }

        return selection;
      });

      onCreate(selection);
    },
    [onCreate]
  );

  useEffect(() => setSelectedList(tags), [tags]);

  return (
    <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId={controlID}>
      <Form.Label className="text-primary mb-0 popup-form-labels">{label}</Form.Label>
      <Form.Text className="d-block text-muted small mb-2">Type and hit enter to add {label}</Form.Text>
      <div
        className={clsx(
          'tags-input-container overflow-auto',
          { 'border border-success': props.isValid },
          { 'border border-danger': props.isInvalid }
        )}
        onClick={handleParentClick}
      >
        <FilterPaginateInput
          {...props}
          multiple
          allowNew
          overflow
          model_label="system_preferences.Tag"
          placeholder="Type Here..."
          controlId={controlID}
          labelKey="name"
          searchIcon={false}
          className="tags-input"
          classNames={{ backgroundClass: 'bg-none', selectClass: 'bg-none' }}
          onSelectChange={onTagSelected}
          selected={selectedList}
          renderToken={(option, { onRemove }, index) => {
            const selection = option as GeneralTags;
            return (
              <Token
                key={index}
                onRemove={onRemove}
                disabled={props.disabled}
                readOnly={props.disabled}
                option={selection}
                className="tag-item"
              >
                <span className="text">{selection.name}</span>
              </Token>
            );
          }}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        />
      </div>
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

export default TagsInput;
