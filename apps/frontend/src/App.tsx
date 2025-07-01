import { Provider } from 'react-redux';

import { store } from 'store/redux';

import { SuspenseHOC } from 'core-ui/suspense/suspense-hoc';

import AuthProvider from 'context/auth-context';

import { RouterWrapper } from 'routes/route-wrapper';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterWrapper />
      </AuthProvider>
    </Provider>
  );
};

export default SuspenseHOC(App);
