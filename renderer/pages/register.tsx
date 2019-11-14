import React from 'react';
import { withApollo } from '../lib/apollo';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Divider, Button } from 'antd';
import { useRouter } from 'next/router';

export default withApollo(
  function registerPage() {
    const router = useRouter();
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
          <SignUpForm
            autoSignIn
            onSubmit={() => {
              router.push('/');
            }}
          />
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
                router.push('/login');
              }}
            >
              登陆 ?
            </Button>
          </div>
        </div>
      </div>
    );
  },
  { ssr: false, needAuth: false },
);
