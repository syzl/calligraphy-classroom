import { useEffect } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import { MixedNextPageContext } from '../lib.interface';
import redirect from '../redirect';

export const login = ({ token = '', expires = 1 }) => {
  cookie.set('token', token, { expires });
  console.info('js-cookie', cookie);
  window.localStorage.setItem('token', token);
  // Router.push('/profile');
};

export const auth = (ctx: MixedNextPageContext) => {
  let { token } = nextCookie(ctx);
  if (!token) {
    token = window.localStorage.getItem('token') || '';
  }
  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */

  // We already checked for server. This should only happen on client.
  if (!token) {
    redirect(ctx, '/');
  }

  return token;
};

export const logout = () => {
  cookie.remove('token');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString());
  window.localStorage.removeItem('token');
  Router.push('/login');
};

export const withAuthSync = (WrappedComponent: NextPage) => {
  const Wrapper: NextPage = props => {
    const syncLogout = (event: any) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/');
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, [null]);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: MixedNextPageContext) => {
    const token = auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
