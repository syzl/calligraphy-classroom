import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import AppAbout from './about';
import AppDashboard from './dashboard';

const wrappers: { [key: string]: FunctionComponent<any> } = {
  '/about': AppAbout,
  '/dashboard': AppDashboard,
};

const DefaultWrapper: FunctionComponent = function({ children }) {
  return <>{children}</>;
};

const DynamicWrapper: FunctionComponent = function({ children }) {
  const { pathname } = useRouter();
  const WrapperComponent = wrappers[pathname] || DefaultWrapper;
  return <WrapperComponent>{children}</WrapperComponent>;
};

export default DynamicWrapper;
