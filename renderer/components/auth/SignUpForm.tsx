import React, { useState } from 'react';
import { Icon, Form, Input, Button } from 'antd';
import { Formik } from 'formik';
import { hasErrors } from '../../lib/utils';

export const SignUpForm = function({ onSubmit }: { onSubmit?: any }) {
  const [loading, setLoading] = useState(false);
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
        console.info('注册', values);
        onSubmit && onSubmit(values);
        setLoading(false);
        // signinUser({
        //   variables: values,
        // });
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
