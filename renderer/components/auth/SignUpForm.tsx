import React, { useState } from 'react';
import { Icon, Form, Input, Button, message } from 'antd';
import { Formik } from 'formik';
import { hasErrors } from '../../lib/utils';
import { signUp, signIn } from '../../lib/api';
import { login } from '../../lib/auth';
import { useApolloClient } from '@apollo/react-hooks';

export const SignUpForm = function({
  onSubmit,
  autoSignIn = false,
}: {
  onSubmit?: any;
  autoSignIn?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  return (
    <Formik
      initialValues={{
        username: '',
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
        setLoading(true);
        localStorage.setItem('__username', values.username);
        try {
          const data = await signUp(values);
          if (autoSignIn) {
            const tokenMeta = await signIn(values);
            console.info('tokenMeta', tokenMeta);
            const { accessToken: token, expiresIn } = tokenMeta;
            login({ token, expires: expiresIn / 60 / 60 / 24 });
            await client.cache.reset();
          }
          onSubmit && onSubmit(data);
          // message.error(`注册成功, 登陆中`);
        } catch (error) {
          message.error(`注册失败${error.message}`);
        }
        setLoading(false);
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
            注册
          </Button>
        </Form>
      )}
    </Formik>
  );
};
