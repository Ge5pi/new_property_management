import { Fragment } from 'react';
import { Badge, Card, Container } from 'react-bootstrap';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { BackButton } from 'components/back-button';

import { IErrorResponse } from 'interfaces/IToast';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Body>
          {isRouteErrorResponse(error) ? (
            <Fragment>
              <ErrorBody
                error={{
                  code: error.status,
                  response: error.statusText,
                  message: error.data as string,
                }}
              />
            </Fragment>
          ) : (
            <ErrorBody error={error as IErrorResponse | string} />
          )}
          <BackButton />
        </Card.Body>
      </Card>
    </Container>
  );
};

interface IErrorBodyProps {
  error: string | IErrorResponse;
}

const ErrorBody = ({ error }: IErrorBodyProps) => {
  if (typeof error === 'string') {
    return <Card.Title className="fw-bold text-black">{error ?? 'Error: Something went wrong!'}</Card.Title>;
  }

  return (
    <Fragment>
      <Card.Title className="fw-bold text-black">
        {error.response ?? 'Error!'}
        {error.code && (
          <Badge pill bg="grayish" className="text-primary text-opacity-50 small fw-normal mx-2 py-2 px-3">
            Error code {error.code}
          </Badge>
        )}
      </Card.Title>
      <Card.Text>{error.message}</Card.Text>
    </Fragment>
  );
};

export default ErrorBoundary;
