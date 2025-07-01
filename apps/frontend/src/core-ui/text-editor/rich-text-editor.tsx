import { MouseEventHandler, ReactNode, isValidElement } from 'react';
import { Form } from 'react-bootstrap';

import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { clsx } from 'clsx';
import { FormikErrors } from 'formik';

import EditorToolbar from './editor-toolbar';

import './text-editor.styles.css';

interface RichTextEditorProps {
  id: string;
  value?: string;
  height?: number;
  isValid?: boolean;
  readOnly?: boolean;
  isInvalid?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  error?: ReactNode | FormikErrors<unknown>[];
  placeholder?: string;
  minified?: boolean;
  attachment?: {
    show: boolean;
    handle?: MouseEventHandler<HTMLButtonElement>;
  };
}

const extensions = [
  Link.configure({
    openOnClick: false,
    defaultProtocol: 'https',
    validate: href => /^https?:\/\//.test(href),
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      HTMLAttributes: {
        class: 'tiptap-list',
      },
    },
    orderedList: {
      keepMarks: true,
      HTMLAttributes: {
        class: 'tiptap-list',
      },
    },
  }),
];

const RichTextEditor = ({
  value: content,
  attachment,
  error,
  id,
  onBlur,
  placeholder = '',
  minified,
  height = 100,
  onChange,
  isInvalid,
  isValid,
  readOnly,
}: RichTextEditorProps) => {
  const editor = useEditor({
    onBlur,
    content,
    extensions,
    editable: !readOnly,
    editorProps: {
      attributes: {
        placeholder,
        style: `height: ${height}px`,
        class: clsx(
          'form-control overflow-auto',
          { 'disabled bg-light': readOnly },
          { 'is-invalid': isInvalid && !readOnly },
          { 'is-valid': isValid && !readOnly }
        ),
      },
    },
    onUpdate({ editor }) {
      if (onChange) {
        if (editor.getText().trim().length) {
          onChange(editor.getHTML());
          return;
        }
        onChange('');
      }
    },
  });
  if (!editor) return null;

  return (
    <Form.Group controlId={id}>
      <div className="border border-1 border-primary border-opacity-25 border-bottom-0 bg-white">
        <EditorToolbar editor={editor} attachment={attachment} minified={minified} />
      </div>
      <EditorContent editor={editor} />
      {error &&
        (isValidElement(error) ? (
          error
        ) : (
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': isInvalid && error })}>
            {Array.isArray(error) ? error.join(' \u2022 ') : error.toString()}
          </Form.Control.Feedback>
        ))}
    </Form.Group>
  );
};

export default RichTextEditor;
