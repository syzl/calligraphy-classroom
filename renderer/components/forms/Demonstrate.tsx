import React from 'react';
import { Formik } from 'formik';
import { Form, Tooltip, Icon, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate } from '../../interfaces';
import { hasErrors, getDepCache } from '../../lib/utils';

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

export default function CreateDemonstrate({
  onCompleted,
  clearCache = true,
}: {
  clearCache?: Boolean;
  onCompleted?: Function;
}) {
  const [createDemonstrate, { loading }] = useMutation<
    { createDemonstrate: Demonstrate },
    { input: { title: string } }
  >(GQL.CREATE_DEMOSTRATE, {
    onCompleted() {
      // 清空查询的缓存
    },
    onError(error) {
      message.error(error.message);
    },
    update(proxy, { data }) {
      // 清空 query 开头的
      if (clearCache) {
        const cache = getDepCache(proxy);
        const { ...cacheQuery } = cache.get('ROOT_QUERY');

        Object.keys(cacheQuery).forEach(key => {
          if (key.startsWith('api_demonstrates(')) {
            delete cacheQuery[key];
            cache.delete(`$ROOT_QUERY.${key}`);
          }
        });
        cache.set('ROOT_QUERY', cacheQuery);
      }
      onCompleted && onCompleted(data);
    },
  });
  return (
    <Formik
      initialValues={{ title: '' }}
      validate={values => {
        const errors = {} as any;
        if (!values.title) {
          errors.title = '必填';
        }
        return errors;
      }}
      onSubmit={values => {
        createDemonstrate({ variables: { input: values } });
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
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title || ''}
          >
            <Input
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              placeholder="演示名称"
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
  );
}
