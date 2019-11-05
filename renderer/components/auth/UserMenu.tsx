import { Menu, message, Icon } from 'antd';
import { useApolloClient } from '@apollo/react-hooks';
import cookie from 'cookie';
import redirect from '../../lib/redirect';
import { ClickParam } from 'antd/lib/menu';

export const UserMenu = function({ onLogout }: { onLogout?: Function }) {
  const apolloClient = useApolloClient();

  const signout = () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1, // Expire the cookie immediately
    });

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
    }
  }

  return (
    <Menu
      onClick={handleMenuClick}
      style={{ background: '#fff', padding: 10, borderRadius: 12 }}
    >
      <Menu.Item key="1">
        <Icon type="user" />
        1st menu item
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="user" />
        2nd menu item
      </Menu.Item>
      <Menu.Item key="logout">
        <Icon type="user" />
        登出
      </Menu.Item>
    </Menu>
  );
};
