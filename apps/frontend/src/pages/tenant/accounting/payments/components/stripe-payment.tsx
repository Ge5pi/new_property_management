import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useCreateTenantPaymentsIntentMutation } from 'services/api/tenants/payments';

import { LoadingDots } from 'components/loading';

import { Notify } from 'core-ui/toast';

import { getReadableError } from 'utils/functions';

const stripe = loadStripe(process.env.REACT_APP_STRIPE_KEY ?? '');

const StripePayment = ({ children }: PropsWithChildren) => {
  const { invoice_id } = useParams();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [
    createIntent,
    { isSuccess: isIntentSuccess, isError: isIntentError, error: IntentError, isLoading, isUninitialized },
  ] = useCreateTenantPaymentsIntentMutation();

  const fetchSecret = useRef(true);
  useLayoutEffect(() => {
    if (fetchSecret.current) {
      fetchSecret.current = false;
      if (invoice_id && Number(invoice_id) > 0) {
        createIntent(Number(invoice_id)).then(response => {
          if (response.data) {
            setClientSecret(response.data.client_secret);
          }
        });
      }
    }
  }, [invoice_id, createIntent]);

  useEffect(() => {
    if (isIntentError && IntentError) {
      Notify.show({
        type: 'warning',
        title: 'Unable to initiate payment process. Please refresh page, and/or contact support for further assistance',
        description: getReadableError(IntentError),
      });
    }
  }, [isIntentError, IntentError]);

  if (clientSecret && isIntentSuccess) {
    return (
      <Elements
        stripe={stripe}
        options={{
          clientSecret,
          loader: 'auto',
          appearance: {
            variables: {
              borderRadius: '0',
              colorPrimary: '#444',
              focusBoxShadow: 'none',
            },
            rules: {
              '.Input:focus': {
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',
                border: '1px solid #111111',
              },
            },
          },
        }}
      >
        {children}
      </Elements>
    );
  }

  if (isLoading || isUninitialized) return <LoadingDots />;
  return (
    <div>
      <p className="text-danger my-5 text-center">
        Unable to initiate payment process. Please refresh page, and/or contact support for further assistance
      </p>
    </div>
  );
};

export default StripePayment;
