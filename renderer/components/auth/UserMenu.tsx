import { Menu, message, Icon } from 'antd';
import { useApolloClient } from '@apollo/react-hooks';
import redirect from '../../lib/redirect';
import { ClickParam } from 'antd/lib/menu';
import { logout } from '../../lib/auth';
import { useContext } from 'react';
import { IdentityContext } from '../identityCtx';
import { useRouter } from 'next/router';

export const UserMenu = function({
  onLogout,
  theEnd,
}: {
  onLogout?: Function;
  theEnd?: Function;
}) {
  const apolloClient = useApolloClient();
  const { setIdentity } = useContext(IdentityContext);
  const router = useRouter();

  const signout = () => {
    logout();
    setIdentity({ username: '', token: '' });
    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/');
    });
  };

  function handleMenuClick(e: ClickParam) {
    switch (e.key) {
      case 'logout':
        signout();
        message.info('已登出');
        onLogout && onLogout();
        break;
      case 'home':
        router.push('/');
        theEnd && theEnd()
        break;
    }
  }

  return (
    <Menu
      onClick={handleMenuClick}
      style={{ background: '#fff', padding: 10, borderRadius: 12 }}
    >
      <Menu.Item key="home">
        <Icon type="home" />
        首页
      </Menu.Item>
      <Menu.Item key="logout">
        <Icon type="user" />
        登出
      </Menu.Item>
    </Menu>
  );
};
