import React from 'react';
import { useRouter } from 'next/router';
import { LoginForm } from '../components/auth/LoginForm';
import { withApollo } from '../lib/apollo';

export default withApollo(function LoginPage() {
  const router = useRouter();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginForm
        onSubmit={() => {
          router.back();
        }}
      />
    </div>
  );
});
