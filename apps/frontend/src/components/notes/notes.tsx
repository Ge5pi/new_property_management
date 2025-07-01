import { InputHTMLAttributes, useState } from 'react';
import { Button, Form, FormControlProps } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { SubmitBtn } from 'components/submit-button';

import { Notify } from 'core-ui/toast';

import { getReadableError } from 'utils/functions';

declare type IType = InputHTMLAttributes<HTMLTextAreaElement> & FormControlProps;
interface IProps extends IType {
  onNoteSubmit?: (note: string) => Promise<void>;
  initialValue?: string;
  controlID: string;
  label: string;
  className?: string;
}

const NotesSchema = Yup.object().shape({
  notes: Yup.string().trim().required('this field is required!'),
});

const Notes = ({ controlID, label, initialValue, onNoteSubmit, ...props }: IProps) => {
  const handleFormSubmission = async (notes: string) => {
    if (onNoteSubmit) return await onNoteSubmit(notes);
  };

  const [showButtons, setButtonState] = useState(false);
  const formik = useFormik({
    initialValues: {
      notes: initialValue ?? '',
    },
    validationSchema: NotesSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      handleFormSubmission(values.notes)
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
          setButtonState(false);
        });
    },
    onReset: () => {
      setButtonState(false);
    },
  });

  const { handleSubmit, setFieldValue, touched, values, isSubmitting, handleReset, handleBlur, errors } = formik;

  return (
    <Form className="text-start" noValidate onSubmit={handleSubmit}>
      <Form.Group controlId={controlID}>
        <Form.Label className="visually-hidden">{label}</Form.Label>
        <NotesControl
          {...props}
          value={values.notes}
          onChange={ev => {
            setButtonState(true);
            setFieldValue('notes', ev.target.value);
          }}
          onBlur={handleBlur}
          isValid={touched.notes && !errors.notes && showButtons}
          isInvalid={touched.notes && !!errors.notes && showButtons}
        />
      </Form.Group>
      {showButtons && (
        <div className="mt-3 d-flex align-items-center justify-content-end">
          <Button
            variant="light border-primary"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-1 me-3"
          >
            Cancel
          </Button>

          <SubmitBtn variant="primary" type="submit" loading={isSubmitting} className="px-4 py-1">
            Update
          </SubmitBtn>
        </div>
      )}
    </Form>
  );
};

export default Notes;

interface NotesControlProps extends IType {
  rows?: number;
}

export const NotesControl = ({ rows = 2, className, name = 'notes', ...props }: NotesControlProps) => {
  return (
    <div className="position-relative">
      <pre
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', minHeight: 80 }}
        className={clsx('form-control p-4 m-0', className)}
      >
        {props.value + '\n'}
      </pre>
      <Form.Control
        {...props}
        name={name}
        rows={rows}
        as="textarea"
        placeholder="Type here..."
        style={{ ...props.style, resize: 'none', backgroundColor: '#eeeeee', minHeight: 80 }}
        className={clsx('p-4 position-absolute top-0 start-0 w-100 h-100', className)}
      />
    </div>
  );
};
