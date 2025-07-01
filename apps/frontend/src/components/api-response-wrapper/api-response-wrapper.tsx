import { Fragment, ReactElement, ReactNode } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { BackButton } from 'components/back-button';
import { LoadingDots } from 'components/loading';

import { getReadableError } from 'utils/functions';

interface IResponseProps<T> {
  showBack?: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  showError?: boolean;
  showMiniError?: boolean;
  loadingComponent?: ReactNode;
  customErrorMessage?: ReactNode;
  renderIfNoResult?: ReactNode;
  renderResults: (data: T) => ReactElement;
  hideIfNoResults?: boolean;
  data?: T;
}

const ApiResponseWrapper = <T,>(params: IResponseProps<T>) => {
  const {
    isLoading,
    isError,
    error,
    showError = true,
    showMiniError,
    showBack = true,
    data,
    loadingComponent,
    renderResults,
    hideIfNoResults,
    customErrorMessage,
    renderIfNoResult,
  } = params;
  if (isLoading) {
    if (loadingComponent) return <Fragment>{loadingComponent}</Fragment>;
    return (
      <div className="text-center">
        <LoadingDots />
      </div>
    );
  }

  if (isError && error) {
    if (!showError) return loadingComponent ? <Fragment>{loadingComponent}</Fragment> : null;
    if (customErrorMessage) return <Fragment>{customErrorMessage}</Fragment>;

    const errorInfo = getReadableError(error);
    if (showMiniError) {
      return (
        <div className="text-danger">
          {typeof errorInfo === 'string' ? (
            <div className="fw-bold text-black" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {errorInfo}
            </div>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{errorInfo.message}</div>
          )}
        </div>
      );
    }

    return (
      <Card className="bg-transparent border-0" style={{ minHeight: '50vh' }}>
        <Card.Body className="text-center d-flex align-items-center justify-content-between flex-column">
          <div className="my-auto">
            {typeof errorInfo === 'string' ? (
              <Card.Title className="fw-bold text-black" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {errorInfo ?? 'Error!'}
              </Card.Title>
            ) : (
              <Fragment>
                <Card.Title className="fw-bold text-black">
                  {errorInfo.response ?? 'Error!'}
                  {errorInfo.code && (
                    <Badge pill bg="grayish" className="text-primary text-opacity-50 small fw-normal mx-2 py-2 px-3">
                      Error code {errorInfo.code}
                    </Badge>
                  )}
                </Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{errorInfo.message}</Card.Text>
                {showBack && <BackButton returnBack />}
              </Fragment>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!data || (Array.isArray(data) && data.length <= 0)) {
    if (hideIfNoResults) return null;
    if (renderIfNoResult) return <Fragment>{renderIfNoResult}</Fragment>;
    return <div className="text-center text-muted">No Result Found</div>;
  }

  return renderResults(data);
};

export default ApiResponseWrapper;
