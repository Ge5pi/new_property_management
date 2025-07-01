import { Component, ComponentType } from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/redux';

export const ProviderHOC = <P extends object>(ReactComponent: ComponentType<P>) =>
  class WithProvider extends Component<P> {
    render() {
      const { ...props } = this.props;
      return (
        <Provider store={store}>
          <ReactComponent {...(props as P)} />
        </Provider>
      );
    }
  };
