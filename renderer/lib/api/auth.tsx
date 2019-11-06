import { useEffect } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import { MixedNextPageContext } from '../lib.interface';

export const login = ({ token = '', expires = 1 }) => {
  cookie.set('token', token, { expires });
  // Router.push('/profile');
};

export const auth = (ctx: any) => {
  const { token } = nextCookie(ctx);

  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  console.info('ctx', ctx.req, !token);
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/');
  }

  return token;
};

export const logout = () => {
  cookie.remove('token');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString());
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
