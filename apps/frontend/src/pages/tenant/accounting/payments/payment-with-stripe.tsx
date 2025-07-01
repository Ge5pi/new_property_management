import { FormEvent, useState } from 'react';
import { Button, Spinner, Stack } from 'react-bootstrap';

import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import useResponse from 'services/api/hooks/useResponse';
import { useCreateTenantPaymentsMutation, useUpdateTenantPaymentsMutation } from 'services/api/tenants/payments';

import { PleaseWait } from 'components/alerts';
import { SubmitBtn } from 'components/submit-button';

import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useAuthState } from 'hooks/useAuthState';
import { useRedirect } from 'hooks/useRedirect';

import { HTTPResponse } from 'constants/http-errors';

import { TenantPaymentType } from 'interfaces/IAccounting';

import StripePayment from './components/stripe-payment';

interface IProps {
  invoice: number;
  amount: number;
  payment_id?: number;
}

const PaymentWithStripe = (props: IProps) => {
  return (
    <StripePayment>
      <PaymentForm {...props} />
    </StripePayment>
  );
};

export default PaymentWithStripe;

const PaymentForm = ({ payment_id, invoice, amount }: IProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { redirect, modifyCurrentPath } = useRedirect();
  const { user } = useAuthState();

  const [
    updatePayment,
    { isSuccess: isUpdatePaymentSuccess, isError: isUpdatePaymentError, error: updatePaymentError },
  ] = useUpdateTenantPaymentsMutation();

  useResponse({
    isSuccess: isUpdatePaymentSuccess,
    successTitle: 'Payment detail has been successfully updated!',
    isError: isUpdatePaymentError,
    error: updatePaymentError,
  });

  const [
    createPayments,
    { isSuccess: isCreatePaymentSuccess, isError: isCreatePaymentError, error: createPaymentError },
  ] = useCreateTenantPaymentsMutation();

  useResponse({
    isSuccess: isCreatePaymentSuccess,
    successTitle: 'Payment has been successfully created!',
    isError: isCreatePaymentError,
    error: createPaymentError,
  });

  const handleFormSubmission = async () => {
    const update = Boolean(Number(payment_id) > 0);
    const data = {
      amount,
      invoice,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'CARD' as TenantPaymentType,
    };

    if (update) {
      return await updatePayment({
        ...data,
        id: Number(payment_id),
      });
    } else {
      return await createPayments(data);
    }
  };

  const [isProcessing, setIsProcessing] = useState<boolean>();
  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    PleaseWait({ description: 'Processing your payment request...' });

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.origin + modifyCurrentPath(`/accounting/${invoice}/details`, 'accounting'),
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        Notify.show({
          type: 'danger',
          title: 'Payment Error',
          description: error.message,
        });
      } else {
        Notify.show({
          type: 'danger',
          title: 'An unexpected error occurred.',
          description: `${error.message}... Please contact support`,
        });
      }

      setIsProcessing(false);
      SwalExtended.close();
      return;
    }

    Notify.show({ type: 'success', title: 'Payment successful, please wait...' });
    setIsProcessing(false);

    const response = await handleFormSubmission();
    if (response.data) {
      const request__id = Number(response.data.id);
      redirect(`/payments/details/${request__id}`, true, 'payments');
    } else {
      Notify.show({
        type: 'warning',
        title: 'Your payment is successful. however, unable to create a payment history.',
        description: 'Please contact support/admin',
      });
    }

    SwalExtended.close();
  };

  if (!user) {
    return <div className="text-center text-danger my-5">{HTTPResponse.find(f => f.code === 401)?.message}</div>;
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-3 position-relative">
        <LinkAuthenticationElement options={{ defaultValues: { email: user.email } }} />
      </div>
      <PaymentElement id="payment-element" />
      <Stack gap={1} direction="horizontal" className="justify-content-end mt-5 align-items-center">
        {isProcessing && <Spinner size="sm" />}
        <Button variant="light border-primary" onClick={() => redirect(-1)} className="px-4 py-1 me-3" type="reset">
          Cancel
        </Button>

        <SubmitBtn type="submit" variant="success" loading={isProcessing} className="px-5 py-1">
          Pay
        </SubmitBtn>
      </Stack>
    </form>
  );
};
