import React from 'react';
import { Formik } from 'formik';
import { Button, message, Tooltip, Icon } from 'antd';
import { Form, Input } from 'formik-antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Course } from '../../interfaces';
import { getDepCache } from '../../lib/utils';
import { formItemLayout, tailFormItemLayout } from './constant';

export default function CreateCourse({
  onCompleted,
  clearCache = true,
}: {
  clearCache?: Boolean;
  onCompleted?: Function;
}) {
  const [createCourse, { loading }] = useMutation<
    { createCourse: Course },
    { input: { name: string } }
  >(GQL.CREATE_COURSE, {
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
          if (key.startsWith('api_courses(')) {
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
      initialValues={{ name: '' }}
      validate={values => {
        const errors = {} as any;
        if (!values.name) {
          errors.name = '必填';
        }
        return errors;
      }}
      onSubmit={values => {
        createCourse({ variables: { input: values } });
      }}
    >
      {() => (
        <Form {...formItemLayout}>
          <Form.Item
            name="name"
            label={
              <span>
                名称&nbsp;
                <Tooltip title="不可重名" placement="left">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            <Input name="name" placeholder="课堂名称" />
          </Form.Item>
          <Form.Item name="~" {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              添加
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
}
