import { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CloseIcon, SearchIcon } from 'core-ui/icons';

import './search-input.styles.css';

interface ISearchInput {
  formClass?: string;
  placeholder?: string;
  onReset?: () => void;
  isSearched?: boolean;
  handleSearch?: (value: string) => Promise<void>;
  defaultValue?: string;
  size?: string;
}

const searchSchema = Yup.object().shape({
  search: Yup.string().trim().required('This field is required!'),
});

const SearchInput = ({
  formClass,
  placeholder = 'Search',
  isSearched = false,
  size,
  handleSearch,
  defaultValue,
  onReset,
}: ISearchInput) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        search: defaultValue ?? '',
      }}
      validationSchema={searchSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (handleSearch) {
          handleSearch(values.search).finally(() => setSubmitting(false));
          return;
        }
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting, handleChange, dirty, handleSubmit, handleReset }) => (
        <Form autoComplete="off" className={formClass} onSubmit={handleSubmit}>
          <Form.Group controlId="searchFormQuery">
            <Form.Label className="visually-hidden">Search</Form.Label>
            <div
              className={clsx(
                'd-flex align-items-center',
                size ? `search-input-wrapper-${size}` : 'search-input-wrapper',
                'position-relative'
              )}
            >
              <Button className="search-icon" size="sm" onClick={() => ref.current?.focus()} disabled={isSubmitting}>
                <SearchIcon />
              </Button>
              <Form.Control
                ref={ref}
                size="sm"
                type="search"
                className="search-input"
                name="search"
                readOnly={isSubmitting}
                placeholder={placeholder}
                value={values.search}
                onChange={handleChange}
              />
              {(dirty || isSearched || values.search.length > 0) && (
                <Button
                  className="reset-icon"
                  size="sm"
                  type="reset"
                  disabled={isSubmitting}
                  onClick={ev => {
                    handleReset(ev);
                    if (onReset) {
                      onReset();
                    }
                  }}
                >
                  <CloseIcon />
                </Button>
              )}
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

export default SearchInput;
