import { ChangeEventHandler, Fragment, ReactNode, useRef } from 'react';
import { Form, Stack } from 'react-bootstrap';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikErrors } from 'formik';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetMyEmailSignaturesListQuery } from 'services/api/email-signature';

import { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { HScroll } from 'core-ui/h-scroll';
import { LazyImage } from 'core-ui/lazy-image';
import { HtmlDisplay } from 'core-ui/render-information';
import { RichTextEditor } from 'core-ui/text-editor';

import { IEmailSignature } from 'interfaces/ICommunication';

import SignatureUpload from './upload-signature';

import './signature.styles.css';

//  extends Omit<QuillOptions, 'theme' | 'formats'>
interface ISignatureProps {
  value?: string;
  isValid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showSavedSignature?: boolean;
  error?: ReactNode | FormikErrors<unknown>[];
  existing?: number | null;
  handleSignatureInput?: (text: string, id?: number) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  controlID: string;
  useImage?: boolean;
  labelText?: string;
}

const Signature = (props: ISignatureProps) => {
  const {
    controlID,
    disabled,
    readOnly,
    handleSignatureInput,
    existing,
    labelText = 'Signature',
    showSavedSignature = true,
    useImage = true,
    ...rest
  } = props;

  const selection = useRef<IEmailSignature | null>(null);
  const signatures = useGetMyEmailSignaturesListQuery(!showSavedSignature ? skipToken : undefined);

  return (
    <Form.Group controlId={controlID}>
      <Stack className="justify-content-between align-items-center" gap={2} direction="horizontal">
        <Form.Label className="form-label-md">{labelText}</Form.Label>
        {useImage && <SignatureUpload />}
      </Stack>
      <RichTextEditor
        {...rest}
        minified
        id={controlID}
        value={rest.value}
        readOnly={readOnly || disabled}
        onChange={val => {
          if (handleSignatureInput) {
            const selected = selection.current;
            const exist =
              selected && (selected.text.toUpperCase() === 'IMAGE' || selected.text.toLowerCase() === val.toLowerCase())
                ? selected
                : null;
            if (exist) {
              const text = exist.text === 'IMAGE' ? '' : exist.text;
              handleSignatureInput(text, Number(exist.id));
              return;
            }

            handleSignatureInput(val);
          }
        }}
        height={80}
        placeholder="Add signature here"
      />

      {showSavedSignature && (
        <ApiResponseWrapper
          {...signatures}
          hideIfNoResults
          showError={false}
          loadingComponent={
            <InformationSkeleton skeletonType="column" columnCount={4} title xs={3}>
              <InlineSkeleton className="ratio ratio-1x1" />
            </InformationSkeleton>
          }
          renderResults={data => {
            return (
              <Fragment>
                {data.length > 0 && (
                  <div className="shadow-sm px-3 py-4 overflow-auto">
                    <HScroll
                      scrollContainerClassName="row align-items-center gx-2 gy-3 flex-nowrap"
                      itemClassName="col-auto"
                      arrowsPos={{ position: 'end', show: 'head' }}
                      headerTitle={<h6 className="fw-bold mb-0">Choose Signature</h6>}
                    >
                      {data.map(item => (
                        <GetSignature
                          signature={item}
                          key={item.id}
                          checked={existing ? existing : selection.current ? Number(selection.current.id) : -1}
                          onChecked={ev => {
                            if (handleSignatureInput) {
                              if (ev.target.checked) {
                                selection.current = item;
                                handleSignatureInput(item.text, Number(item.id));
                                return;
                              }

                              selection.current = null;
                              handleSignatureInput('');
                            }
                          }}
                        />
                      ))}
                    </HScroll>
                  </div>
                )}
              </Fragment>
            );
          }}
        />
      )}
    </Form.Group>
  );
};

interface ISignature {
  signature: IEmailSignature;
  onChecked: ChangeEventHandler<HTMLInputElement>;
  checked?: number;
}

const GetSignature = ({ signature, onChecked, checked }: ISignature) => {
  return (
    <label className="radio-img" htmlFor={`sig_input_${signature.id}`}>
      <input
        id={`sig_input_${signature.id}`}
        type="checkbox"
        name="signature"
        value={signature.id}
        checked={checked === Number(signature.id)}
        onChange={onChecked}
      />
      <div className="image">
        {signature.image ? (
          <LazyImage src={signature.image} objectFit="contain" size="sm" preview={false} />
        ) : (
          <HtmlDisplay disableMargin value={signature.text} className="signature-text small fw-bold text-center" />
        )}
      </div>
    </label>
  );
};

export default Signature;
