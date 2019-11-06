import { Icon, Form, Input, Button, message } from 'antd';
import { Formik } from 'formik';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import redirect from '../../lib/redirect';
import * as GQL from '../../lib/gql';
import { SignInReturn } from '../../interfaces';
import { hasErrors } from '../../lib/utils';
import { login } from '../../lib/api/auth';

export const LoginForm = function({ onSubmit }: { onSubmit?: any }) {
  const client = useApolloClient();

  const onCompleted: (data: { signinUser: SignInReturn }) => any = data => {
    // Store the token in cookie
    const { accessToken: token, expiresIn } = data.signinUser;
    login({ token, expires: expiresIn / 60 / 60 / 24 });
    // Force a reload of all the current queries now that the user is
    // logged in
    client.cache.reset().then(() => {
      redirect({}, '/');
    });

    onSubmit && onSubmit();
  };

  const onError = (error: any) => {
    message.error(error.message || '登陆错误');
  };

  const [signinUser, { error, loading }] = useMutation<
    { signinUser: SignInReturn },
    { username: string; password: string }
  >(GQL.SIGN_IN, {
    onCompleted,
    onError,
  });

  if (error) {
    console.info('error', error);
  }

  return (
    <Formik
      initialValues={{
        username: localStorage.getItem('__username') || '',
        password: '',
      }}
      validate={values => {
        const errors: any = {};
        if (!values.username) {
          errors.username = '必填';
        }
        if (!values.password) {
          errors.password = '必填';
        }
        return errors;
      }}
      onSubmit={async values => {
        localStorage.setItem('__username', values.username);
        signinUser({
          variables: values,
        });
      }}
    >
      {({
        values,
        errors,
        // touched,
        handleChange,
        handleBlur,
        handleSubmit,
        /* and other goodies */
      }) => (
        <Form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Form.Item
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username || ''}
          >
            <Input
              name="username"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
          </Form.Item>
          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password || ''}
          >
            <Input
              name="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={hasErrors(errors)}
            style={{ width: '100%' }}
          >
            登录
          </Button>
        </Form>
      )}
    </Formik>
  );
};
