import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider } from 'antd';
import { LoginForm } from '../components/auth/LoginForm';
import { withApollo } from '../lib/apollo';
import checkLoggedIn from '../lib/checkLoggedIn';
import { NextPage } from 'next';
import { MixedNextPageContext } from '../lib/lib.interface';
import redirect from '../lib/redirect';

const LoginPage: NextPage = function() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: 320 }}>
        {show ? (
          <LoginForm
            onSubmit={() => {
              router.push('/');
            }}
          />
        ) : null}
        <Divider />
        <div>
          <Button
            icon="home"
            type="link"
            onClick={() => {
              router.push('/');
            }}
          />
          <Button
            onClick={() => {
              router.push('/register');
            }}
          >
            注册 ?
          </Button>
        </div>
      </div>
    </div>
  );
};
LoginPage.getInitialProps = async (context: MixedNextPageContext) => {
  const { whoami } = await checkLoggedIn(context.apolloClient);
  if (whoami.username) {
    redirect(context, '/');
  }
  return {};
};
export default withApollo(LoginPage, { ssr: false, needAuth: false });
