import { useState } from 'react';
import { Button, Form, OverlayTrigger, Popover, ProgressBar } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useCreateEmailSignatureMutation } from 'services/api/email-signature';
import useResponse from 'services/api/hooks/useResponse';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { SubmitBtn } from 'components/submit-button';

import { DeleteBtn } from 'core-ui/delete-btn';
import { LazyImage } from 'core-ui/lazy-image';
import { Notify } from 'core-ui/toast';

import { usePhoto } from 'hooks/usePhoto';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_IMAGES } from 'constants/file-types';
import { getReadableError, renderFormError } from 'utils/functions';

const SignatureUpload = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <OverlayTrigger
        flip
        show={show}
        trigger="click"
        onToggle={() => setShow(prev => !prev)}
        placement="bottom-end"
        overlay={overlayProps => (
          <Popover {...overlayProps} className="stay-on-top" arrowProps={{ style: { display: 'none' } }}>
            <div className="m-2">
              <UploadSignature handleClose={() => setShow(false)} />
            </div>
          </Popover>
        )}
      >
        <Button size="sm" variant="link" className="link-info p-0">
          Use image
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default SignatureUpload;

const SignatureSchema = Yup.object().shape({
  image_preview: Yup.boolean().default(false),
  file: Yup.mixed()
    .when('image_preview', {
      is: false,
      then: schema => schema.required('this filed is required!'),
    })
    .nullable(),
});

interface IProps {
  handleClose: () => void;
}

const UploadSignature = ({ handleClose }: IProps) => {
  const { preview, updatePreview, hasImage } = usePhoto();
  const { setSelectedFiles, selectedFiles, setTotalFiles, handleUpload, totalUploadProgress } =
    useUploader('signatures');

  const [
    createSignature,
    { isSuccess: isCreateSignatureSuccess, isError: isCreateSignatureError, error: createSignatureError },
  ] = useCreateEmailSignatureMutation();
  useResponse({
    isSuccess: isCreateSignatureSuccess,
    successTitle: 'New Email Signature has been added',
    isError: isCreateSignatureError,
    error: createSignatureError,
  });

  const handleFormSubmission = async () => {
    if (selectedFiles && selectedFiles.length) {
      const signature = await handleUpload(selectedFiles[0]).then(data => data.unique_name);
      return await createSignature({ text: 'IMAGE', image: signature });
    }

    return Promise.reject('Incomplete data found');
  };

  const formik = useFormik({
    initialValues: {
      image_preview: hasImage,
      file: null,
    },
    validationSchema: SignatureSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      handleFormSubmission()
        .then(result => {
          if (result.data) {
            handleClose();
          } else {
            const error = result.error as BaseQueryError;
            if (error.status === 400 && error.data) {
              renderFormError(error.data, setFieldError);
            }
          }
        })
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const { values, handleSubmit, setFieldValue, setFieldError, isSubmitting, handleReset, errors } = formik;

  const setImageError = (error: string) => setFieldError('file', error);
  const onDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      const canvas = document.querySelector('#signatureCanvas') as HTMLCanvasElement | null;
      const ctx = canvas ? canvas.getContext('2d', { willReadFrequently: true }) : null;
      reader.onload = function (e: ProgressEvent<FileReader>) {
        let image_selected = false;
        const target = e.target;
        if (target && target.result) {
          if (canvas && ctx) {
            const img = new Image();
            img.onload = function () {
              canvas.width = 200;
              canvas.height = 80;

              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const isValid = verifyBackground(canvas, ctx);

              if (isValid) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                canvas.width = img.width;
                canvas.height = canvas.width * (img.height / img.width);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const resizedImg = trimCanvas(canvas, ctx).toDataURL('image/png', 1);
                fetch(resizedImg)
                  .then(res => res.arrayBuffer())
                  .then(buf => {
                    const resultFile = new File([buf], file.name, { type: file.type });
                    updatePreview(resizedImg);
                    setSelectedFiles([resultFile]);
                    setFieldValue('file', [resultFile]);
                    setTotalFiles(acceptedFiles.length);
                  })
                  .catch(() => {
                    setImageError('unable to process image. Please try again');
                    return;
                  });

                return;
              }

              setImageError('please upload image with white or transparent background only');
              return;
            };

            img.onerror = () => setImageError('unable to process image. Please try again');
            img.src = target.result.toString();
            image_selected = true;
          }
        }

        if (!image_selected) setImageError('unable to process image. Please try again');
        return;
      };

      reader.readAsDataURL(file);
      reader.onerror = () => setImageError('unable to process image. Please try again');
    }
  };

  const handleImageRemove = async () => {
    setSelectedFiles([]);
    setFieldValue('file', null);
    setFieldValue('image_preview', false);
    updatePreview(undefined);
  };

  return (
    <Form className="text-start" style={{ width: 250, minHeight: 250 }} noValidate onSubmit={handleSubmit}>
      <canvas id="signatureCanvas" className="d-none"></canvas>
      {(values.file && !values.image_preview) || (values.image_preview && typeof preview === 'string') ? (
        <div className={'rounded-1 border border-dark overflow-hidden position-relative'}>
          <DeleteBtn
            resetCSS
            className="position-absolute rounded-circle bg-white end-0 m-3"
            onClick={handleImageRemove}
            style={{ zIndex: 1250 }}
          />
          <LazyImage src={preview} size="4x3" objectFit="contain" />
          {isSubmitting && <ProgressBar variant="info" now={Number(totalUploadProgress)} />}
        </div>
      ) : (
        <Form.Group controlId={`FormSignatureImage`}>
          <div className="ratio ratio-4x3">
            <Dropzone
              name="file"
              onDrop={onDrop}
              accept={FILE_TYPES_IMAGES}
              multiple={false}
              maxSize={1e6}
              maxFiles={1}
              onError={error => setFieldError('file', error.message)}
            />
          </div>
        </Form.Group>
      )}
      <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.file })}>
        {errors.file}
      </Form.Control.Feedback>
      <div className="mt-2 gap-2 d-flex align-items-center justify-content-end">
        <Button
          size="sm"
          type="reset"
          onClick={ev => {
            handleClose();
            handleReset(ev);
          }}
          disabled={isSubmitting}
          variant="light border-primary"
          className="px-4 py-1"
        >
          Cancel
        </Button>

        <SubmitBtn
          size="sm"
          variant="primary"
          type="submit"
          disabled={selectedFiles.length <= 0}
          loading={isSubmitting}
          className="px-4 py-1"
        >
          Upload
        </SubmitBtn>
      </div>
    </Form>
  );
};

const verifyBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let hasTransparentPixels,
    hasWhiteBackground = false;
  for (let i = 0; i < pixelData.length; i += 4) {
    if (pixelData[i + 3] < 255) {
      hasTransparentPixels = true;
      break;
    }
    if (pixelData[i] !== 255 || pixelData[i + 1] !== 255 || pixelData[i + 2] !== 255) {
      hasWhiteBackground = false;
    } else {
      hasWhiteBackground = true;
    }
  }

  if (hasTransparentPixels || hasWhiteBackground) {
    return true;
  }
  return false;
};

declare type CanvasBounds = { top: null | number; left: null | number; right: null | number; bottom: null | number };
const trimCanvas = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const copy = document.createElement('canvas').getContext('2d', { willReadFrequently: true }),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    pix = pixels.data,
    l = pixels.data.length,
    bound: CanvasBounds = {
      top: null,
      left: null,
      right: null,
      bottom: null,
    },
    newColor = { r: 0, g: 0, b: 0, a: 0 };

  let x = 0,
    y = 0;
  for (let i = 0, n = pix.length; i < n; i += 4) {
    const r = pix[i],
      g = pix[i + 1],
      b = pix[i + 2];
    if (r === 255 && g === 255 && b === 255) {
      // Change the white to the new color.
      pix[i] = newColor.r;
      pix[i + 1] = newColor.g;
      pix[i + 2] = newColor.b;
      pix[i + 3] = newColor.a;
    }
  }

  ctx.putImageData(pixels, 0, 0);

  // Iterate over every pixel to find the highest
  // and where it ends on every axis ()
  for (let i = 0; i < l; i += 4) {
    if (pix[i + 3] !== 0) {
      x = ((i / 4) % c.width) + 1.25;
      y = ~~(i / 4 / c.width) + 1.25;

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  if (copy && bound.bottom && bound.top && bound.right && bound.left) {
    // Calculate the height and width of the content
    const trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;

    copy.putImageData(trimmed, 0, 0);
    // Return trimmed canvas
    return copy.canvas;
  }

  return c;
};
