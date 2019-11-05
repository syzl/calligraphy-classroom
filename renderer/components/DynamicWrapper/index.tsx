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

const getTopRoute = (pathname: string) => {
  pathname = `${pathname}/`;
  return pathname.slice(0, pathname.indexOf('/', 1));
};
const DynamicWrapper: FunctionComponent = function({ children }) {
  const { pathname } = useRouter();
  const topRoute = getTopRoute(pathname);
  const WrapperComponent = wrappers[topRoute] || DefaultWrapper;
  return <WrapperComponent>{children}</WrapperComponent>;
};

export default DynamicWrapper;
