import React from 'react';
import { Formik } from 'formik';
import { Button, message, Tooltip, Icon } from 'antd';
import { Form, Input, Select } from 'formik-antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate } from '../../interfaces';
import { getDepCache } from '../../lib/utils';

import { formItemLayout, tailFormItemLayout } from './constant';

const { Option } = Select;

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
      initialValues={{ title: '', desc: '', type: '', subType: '', author: '' }}
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
      {() => (
        <Form {...formItemLayout}>
          <Form.Item
            name="title"
            label={
              <span>
                名称&nbsp;
                <Tooltip title="所在课程或碑帖等简要段落信息" placement="left">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            <Input name="title" placeholder="演示名称" />
          </Form.Item>
          <Form.Item name="desc" label="介绍">
            <Input.TextArea name="desc" placeholder="详细介绍" />
          </Form.Item>

          <Form.Item name="type" label="类型">
            <Select
              name="type"
              placeholder="选择类型"
              showSearch
              style={{ width: 200 }}
              optionFilterProp="children"
              onSearch={val => {
                console.log('search:', val);
              }}
              filterOption={(input, option) => {
                console.info('options', option, input);
                return false;
                // const r =
                //   option.props.children
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0;
                // return r;
              }}
            >
              <Option value="hard">硬笔</Option>
              <Option value="soft">毛笔</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subType" label="更多类型">
            <Input name="subType" placeholder="更多类型" />
          </Form.Item>
          <Form.Item name="author" label="作者">
            <Input name="author" placeholder="作者" />
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
