import { Component, ComponentType, Suspense } from 'react';

import { LoadingDots } from 'components/loading';

export const SuspenseHOC = <P extends object>(ReactComponent: ComponentType<P>) =>
  class WithLoading extends Component<P> {
    render() {
      const { ...props } = this.props;
      return (
        <Suspense fallback={<LoadingDots />}>
          <ReactComponent {...(props as P)} />
        </Suspense>
      );
    }
  };
