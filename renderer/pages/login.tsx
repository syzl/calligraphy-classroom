import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider } from 'antd';
import { LoginForm } from '../components/auth/LoginForm';
import { withApollo } from '../lib/apollo';

export default withApollo(
  function LoginPage() {
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
  },
  { ssr: false, needAuth: false },
);
