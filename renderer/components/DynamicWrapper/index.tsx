import {
  FunctionComponent,
  // useState
} from 'react';
import { useRouter } from 'next/router';

import AppAbout from './about';
import AppDashboard from './dashboard';
import Status from '../Status';
import { WhoAmI } from '../../interfaces';

type Props = {
  whoami?: WhoAmI;
};

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
const DynamicWrapper: FunctionComponent<Props> = function({
  // whoami,
  children,
}) {
  const { pathname = '' } = useRouter();
  const topRoute = getTopRoute(pathname);
  const WrapperComponent = wrappers[topRoute] || DefaultWrapper;
  return (
    <WrapperComponent>
      <Status />
      {children}
    </WrapperComponent>
  );
};

export default DynamicWrapper;
