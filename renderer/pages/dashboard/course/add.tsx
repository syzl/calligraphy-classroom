import React from 'react';
import { Formik } from 'formik';
import { Form, Tooltip, Icon, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { GQL } from '../../../lib/gql';
import { Course } from '../../../interfaces';
import { hasErrors, getDepCache } from '../../../lib/utils';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
export default withApollo(function Add() {
  const { push } = useRouter();
  const [createCourse, { loading }] = useMutation<
    { createCourse: Course },
    { name: string }
  >(GQL.CREATE_COURSE, {
    onCompleted() {
      // 清空查询的缓存
    },
    onError(error) {
      message.error(error.message);
    },
    update(proxy) {
      // 清空 query 开头的
      const cache = getDepCache(proxy);
      const { ...cacheQuery } = cache.get('ROOT_QUERY');

      Object.keys(cacheQuery).forEach(key => {
        if (key.startsWith('api_courses(')) {
          delete cacheQuery[key];
          cache.delete(`$ROOT_QUERY.${key}`);
        }
      });
      cache.set('ROOT_QUERY', cacheQuery);
      push('/dashboard/course');
    },
  });

  return (
    <div>
      <h1>添加</h1>
      <div>
        <Formik
          initialValues={{ name: '' }}
          validate={values => {
            const errors = {} as any;
            if (!values.name) {
              errors.name = '必填';
            }
            return errors;
          }}
          onSubmit={values => {
            createCourse({ variables: values });
          }}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form {...formItemLayout} onSubmit={handleSubmit}>
              <Form.Item
                label={
                  <span>
                    名称&nbsp;
                    <Tooltip title="不可重名">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name || ''}
              >
                <Input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="课堂名称"
                />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={hasErrors(errors)}
                >
                  添加
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
});
