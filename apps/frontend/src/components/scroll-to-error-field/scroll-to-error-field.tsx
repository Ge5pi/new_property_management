import { useEffect, useState } from 'react';

import { FormikErrors, FormikValues, useFormikContext } from 'formik';

const ScrollToErrorField = () => {
  const { submitCount, isValid, errors } = useFormikContext();
  const [lastHandled, setLastHandled] = useState(0);

  useEffect(() => {
    if (isValid) return;
    if (submitCount > lastHandled) {
      const fieldErrorNames = getFieldErrorNames(errors);
      if (fieldErrorNames.length <= 0) return;

      setLastHandled(submitCount);
      const element =
        document.querySelector(`input[name='${fieldErrorNames[0]}']`) ||
        // In case of dropzone, we need to scroll to the parent element b/c input is hidden by default - id should be dropzone-<field-name>
        document.querySelector(`#dropzone-${fieldErrorNames[0]}`);

      if (!element) return;

      // Scroll to first known error into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitCount, lastHandled, errors, isValid]);

  return null;
};

const getFieldErrorNames = (formikErrors: FormikErrors<FormikValues>) => {
  const transformObjectToDotNotation = (obj: FormikErrors<FormikValues>, prefix = '', result: string[] = []) => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        transformObjectToDotNotation(value as FormikErrors<FormikValues>, nextKey, result);
      } else {
        result.push(nextKey);
      }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
};

export default ScrollToErrorField;
